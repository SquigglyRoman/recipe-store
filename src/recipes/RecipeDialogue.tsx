import { useEffect, useRef, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import eventBus from "../events/EventBus";
import { EventType } from "../events/Events";
import PlaceholderImage from "../resources/PlaceholderImage";
import { encodeFile } from "./Base64";
import { Metadata, Recipe } from "./models";
import InteractableTag from "../tags/InteractableTag";

type RecipeCardEditProps = {
  title: string;
  show: boolean;
  recipeFileIsMandatory?: boolean;
  onHide: () => void;
  onSubmit: (
    metadata: Metadata,
    recipeFile?: File,
    thumbnail?: File
  ) => Promise<void>;
  onSuccess: () => void;
  currentRecipe?: Recipe;
};

const RecipeDialogue: React.FC<RecipeCardEditProps> = ({
  title,
  show,
  recipeFileIsMandatory,
  onHide,
  onSubmit,
  onSuccess,
  currentRecipe,
}) => {
  const [validated, setValidated] = useState(false);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [recipeName, setRecipeName] = useState<string>(
    currentRecipe?.metadata.name ?? ""
  );
  const [tags, setTags] = useState<string>(
    currentRecipe?.metadata.tags.join(", ") ?? ""
  );
  const [selectedRecipeFile, setSelectedRecipeFile] = useState<File>();
  const [selectedThumbnail, setSelectedThumbnail] = useState<File>();

  const [displayedThumbnail, setDisplayedThumbnail] = useState<string>(
    currentRecipe?.thumbnailUrl ?? PlaceholderImage
  );
  const [error, setError] = useState<string>("");

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const recipeFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValidated(false);
  }, [recipeName, tags, selectedRecipeFile]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    if (!checkFormValidity(event)) {
      return;
    }

    setIsSaving(true);

    const metadata: Metadata = {
      name: recipeName,
      tags: tags.split(",").map((tag) => tag.trim()),
    };

    try {
      await onSubmit(metadata, selectedRecipeFile, selectedThumbnail);
      eventBus.emit<EventType.RECIPE_UPDATED>(EventType.RECIPE_UPDATED, {});
      resetInputs();
      onSuccess();
    } catch (error) {
      setError("Something went wrong, please try again later.");
      console.log(error);
    }

    setIsSaving(false);
  }

  function resetInputs() {
    setRecipeName("");
    setTags("");
    setSelectedRecipeFile(undefined);
    setSelectedThumbnail(undefined);
    setDisplayedThumbnail(PlaceholderImage);
  }

  function checkFormValidity(event: React.FormEvent<HTMLFormElement>): boolean {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    return form.checkValidity();
  }

  function onSuggestedTagClick(tagName: string): void {
    const currentTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (currentTags.includes(tagName)) {
        return;
    }
      currentTags.push(tagName);
      const newTagsString = currentTags.length === 1 ? currentTags[0] : currentTags.join(", ");
      setTags(newTagsString);
  }

  function handleFileSelected(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setSelectedRecipeFile(event.target.files?.[0]);
  }

  async function handleThumbnailSelected(
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setSelectedThumbnail(file);
    setDisplayedThumbnail(await encodeFile(file, "WITH_TYPE_INFORMATION"));
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="formImage">
            <Form.Label>Thumbnail</Form.Label>
            <div className="d-flex flex-column col-7 col-xl-4">
              <img
                className="img-fluid rounded mb-2"
                src={displayedThumbnail}
                alt="Recipe thumbnail"
              />
              <Button
                variant="outline-primary"
                onClick={() => thumbnailInputRef.current?.click()}
              >
                Select image
              </Button>
            </div>
            <Form.Control
              type="file"
              accept="image/*"
              ref={thumbnailInputRef}
              onChange={handleThumbnailSelected}
              style={{ display: "none" }}
            />
          </Form.Group>
          <Form.Group controlId="formRecipeName" className="mt-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please choose a name for the recipe
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mt-3" controlId="formTags">
            <Form.Label>Tags</Form.Label>
            <span className="d-flex flex-row gap-1 mb-2">
              {[
                "Hauptgang",
                "Abendessen",
                "Vegan",
                "Süß",
                "Nachtisch",
                "Nudeln",
                "Schnell",
              ].map((mealType) => (
                <InteractableTag
                  tagName={mealType}
                  onClick={onSuggestedTagClick}
                />
              ))}
            </span>
            <Form.Control
              required
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide at least one tag
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mt-3" controlId="formFile">
            <Form.Label>Recipe file</Form.Label>
            <Form.Control
              required={recipeFileIsMandatory}
              type="file"
              accept="application/pdf"
              ref={recipeFileInputRef}
              onChange={handleFileSelected}
            />
            {recipeFileIsMandatory && (
              <Form.Control.Feedback type="invalid">
                Please choose a PDF file
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <span className="d-flex gap-2 mt-3">
            <Button variant="secondary" onClick={onHide}>
              Close
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSaving}
              className="d-flex align-items-center gap-2"
            >
              {isSaving ? "Saving..." : "Save"}
              {isSaving && <Spinner animation="border" size="sm" />}
            </Button>
          </span>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {error && <p className="text-danger">{error}</p>}
      </Modal.Footer>
    </Modal>
  );
};

export default RecipeDialogue;
