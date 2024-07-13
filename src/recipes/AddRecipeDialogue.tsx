import { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import eventBus from '../events/EventBus';
import { EventType } from '../events/Events';
import { encodeFile } from './Base64';
import { Metadata } from './models';
import PlaceholderImage from './PlaceholderImage';
import { uploadNewRecipe } from './recipeApi';

type RecipeCardEditProps = {
    show: boolean;
    onHide: () => void;
}

type Thumbnail = {
    file: File,
    base64: string
}

const RecipeCardEdit: React.FC<RecipeCardEditProps> = ({ show, onHide }) => {
    const [validated, setValidated] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [recipeName, setRecipeName] = useState('');
    const [tags, setTags] = useState<string>('');
    const [recipeFile, setRecipeFile] = useState<File>(new File([], ''));
    const [thumbnail, setThumbnail] = useState<Thumbnail | undefined>();
    const [error, setError] = useState<string>('');

    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const recipeFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setValidated(false);
    }, [recipeName, tags, recipeFile]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        checkFormValidity(event);

        if (!isFormValid) {
            return;
        }

        const metadata: Metadata = {
            name: recipeName,
            tags: tags.split(',').map(tag => tag.trim())
        }

        try {
            await uploadNewRecipe(metadata, recipeFile, thumbnail?.file);
            eventBus.emit<EventType.RECIPE_UPDATED>(EventType.RECIPE_UPDATED, {});
        } catch (error) {
            setError('Something went wrong, please try again later.');
            console.log(error)
        }

        setIsSaving(false);


    }

    function checkFormValidity(event: React.FormEvent<HTMLFormElement>): void {
        const form = event.currentTarget
        setIsFormValid(form.checkValidity());
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
    }



    function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>): void {
        const file = event.target.files?.[0];
        if (file) {
            setRecipeFile(file);
        };
    }

    async function handleThumbnailSelected(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        setThumbnail({
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
                    Add new recipe
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group controlId="formImage" className='w-50' >
                        <Form.Label>Thumbnail</Form.Label>
                        <div className="d-flex flex-column">
                            <img src={thumbnail?.base64 ?? PlaceholderImage} alt="Recipe" className="img-fluid rounded mb-2" />
                            <Button variant="outline-primary" onClick={() => thumbnailInputRef.current?.click()}>Select image</Button>
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
                        <Form.Label>New PDF file</Form.Label>
                        <Form.Control
                            required
                            type="file"
                            accept='application/pdf'
                            ref={recipeFileInputRef}
                            onChange={handleFileSelected}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please choose a PDF file
                        </Form.Control.Feedback>
                    </Form.Group>
                    <span className='d-flex gap-2 mt-3'>
                        <Button variant="secondary" onClick={onHide}>Close</Button>
                        <Button type="submit" variant="primary" disabled={isSaving} className="d-flex align-items-center gap-2">
                            Save
                            {isSaving && <Spinner animation="border" size='sm' />}
                        </Button>
                    </span>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {error && <p className='text-danger'>{error}</p>}

            </Modal.Footer>
        </Modal>
    );
};

export default RecipeCardEdit;