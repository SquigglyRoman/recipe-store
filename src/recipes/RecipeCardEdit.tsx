import React, { useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import eventBus from '../events/EventBus';
import { EventType } from '../events/Events';
import { Recipe } from './models';
import { updateMetadata } from './recipeApi';

interface RecipeCardEditProps {
    recipe: Recipe;
    show: boolean;
    onHide: () => void;
}

const RecipeCardEdit: React.FC<RecipeCardEditProps> = ({ recipe, show, onHide }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [newRecipeName, setNewRecipeName] = useState(recipe.metadata.name);
    const [newTags, setNewTags] = useState<string[]>(recipe.metadata.tags);

    async function onSave(): Promise<void> {
        setIsSaving(true);
        const newRecipe: Recipe = {
            ...recipe,
            metadata: {
                ...recipe.metadata,
                name: newRecipeName,
                tags: newTags
            }
        }

        await updateMetadata(newRecipe);

        eventBus.emit<EventType.RECIPE_UPDATED>(EventType.RECIPE_UPDATED, { recipe: newRecipe });
        // TODO: Add feedback when successful, e.g. a toast
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
                            value={newTags.join(', ')}
                            onChange={(e) => setNewTags(e.target.value.split(', '))}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
                <Button variant="primary" onClick={onSave} className="d-flex align-items-center gap-2">
                    Save
                    {isSaving && <Spinner animation="border" size='sm'/>}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RecipeCardEdit;