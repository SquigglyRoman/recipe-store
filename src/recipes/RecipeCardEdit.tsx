import React, { useState } from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import eventBus from '../events/EventBus';
import { EventType } from '../events/Events';
import { Recipe } from './models';
import { updateMetadata, uploadRecipeFile } from './recipeApi';
import { useRef } from 'react';

interface RecipeCardEditProps {
    recipe: Recipe;
    show: boolean;
    onHide: () => void;
}

const RecipeCardEdit: React.FC<RecipeCardEditProps> = ({ recipe, show, onHide }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [newRecipeName, setNewRecipeName] = useState(recipe.metadata.name);
    const [newTags, setNewTags] = useState<string>(recipe.metadata.tags.join(', '));
    const [newFile, setNewFile] = useState<File | undefined>(undefined);
    const [error, setError] = useState<string>('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    async function onSave(): Promise<void> {
        setIsSaving(true);
        const newRecipe: Recipe = {
            ...recipe,
            metadata: {
                ...recipe.metadata,
                name: newRecipeName,
                tags: newTags.replace(/\s/g, '').split(','),
            }
        }

        try {
            await updateMetadata(newRecipe);
            newFile && await uploadRecipeFile(recipe, newFile);
        } catch (error) {
            setError('Something went wrong, please try again later.');
            console.log(error);
            setIsSaving(false);
            return;
        }

        eventBus.emit<EventType.RECIPE_UPDATED>(EventType.RECIPE_UPDATED, { recipe: newRecipe });
        setIsSaving(false);
    }

    function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>): void {
        setNewFile(event.target.files?.[0]);
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
                    <Form.Group controlId="formRecipeName">
                        <Form.Label>Recipe Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={newRecipeName}
                            onChange={(e) => setNewRecipeName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mt-2" controlId="formTags">
                        <Form.Label>Tags</Form.Label>
                        <Form.Control
                            type="text"
                            value={newTags}
                            onChange={(e) => setNewTags(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mt-2" controlId="formFile">
                        <Form.Label>Update recipe PDF</Form.Label>
                        <Form.Control
                            type="file"
                            accept='.pdf'
                            ref={fileInputRef}
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