import React, { useRef, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import eventBus from '../events/EventBus';
import { EventType } from '../events/Events';
import { encodeFile } from './Base64';
import PlaceholderImage from './PlaceholderImage';
import { Metadata, Recipe } from './models';
import { updateRecipe } from './recipeApi';

type RecipeCardEditProps = {
    recipe: Recipe;
    show: boolean;
    onHide: () => void;
}

type Thumbnail = {
    file: File,
    base64: string
}

const RecipeCardEdit: React.FC<RecipeCardEditProps> = ({ recipe, show, onHide }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [newRecipeName, setNewRecipeName] = useState(recipe.metadata.name);
    const [newTags, setNewTags] = useState<string>(recipe.metadata.tags.join(', '));
    const [newRecipeFile, setNewRecipeFile] = useState<File | undefined>(undefined);
    const currentThumbnail: string = recipe.files.previewImage?.url ?? PlaceholderImage;
    const [newThumbnail, setNewThumbnail] = useState<Thumbnail>();
    const [error, setError] = useState<string>('');

    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const recipeFileInputRef = useRef<HTMLInputElement>(null);

    async function onSave(): Promise<void> {
        setIsSaving(true);
        const newMetadata: Metadata = {
            name: newRecipeName,
            tags: newTags.split(',').map(tag => tag.trim())
        };

        try {
            await updateRecipe(recipe.path, newMetadata, newRecipeFile, newThumbnail?.file);
        } catch (error) {
            setError('Something went wrong, please try again later.');
            console.log(error);
            setIsSaving(false);
            return;
        }

        eventBus.emit<EventType.RECIPE_UPDATED>(EventType.RECIPE_UPDATED, { recipe: newMetadata });
        setIsSaving(false);
    }

    function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>): void {
        setNewRecipeFile(event.target.files?.[0]);
    }

    async function handleThumbnailSelected(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        setNewThumbnail({
            file,
            base64: await encodeFile(file, 'WITH_TYPE_INFORMATION')
        });
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
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit recipe
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formImage" className='w-50'>
                        <Form.Label>Thumbnail</Form.Label>
                        <div className="d-flex flex-column">
                            <img src={newThumbnail?.base64 ?? currentThumbnail} alt="Recipe" className="img-fluid rounded mb-2" />
                            <Button variant="outline-primary" onClick={() => thumbnailInputRef.current?.click()}>Select new image</Button>
                        </div>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            ref={thumbnailInputRef}
                            onChange={handleThumbnailSelected}
                            style={{ display: 'none' }}
                        />
                    </Form.Group>
                    <Form.Group controlId="formRecipeName" className='mt-3'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={newRecipeName}
                            onChange={(e) => setNewRecipeName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mt-3" controlId="formTags">
                        <Form.Label>Tags</Form.Label>
                        <Form.Control
                            type="text"
                            value={newTags}
                            onChange={(e) => setNewTags(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mt-3" controlId="formFile">
                        <Form.Label>New PDF file</Form.Label>
                        <Form.Control
                            type="file"
                            accept='application/pdf'
                            ref={recipeFileInputRef}
                            onChange={handleFileSelected}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {error && <p className='text-danger'>{error}</p>}
                <span className='d-flex gap-1'>
                    <Button variant="secondary" onClick={onHide}>Close</Button>
                    <Button variant="primary" onClick={onSave} disabled={isSaving} className="d-flex align-items-center gap-2">
                        Save
                        {isSaving && <Spinner animation="border" size='sm' />}
                    </Button>
                </span>
            </Modal.Footer>
        </Modal>
    );
};

export default RecipeCardEdit;