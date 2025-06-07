import React, { useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import eventBus from '../events/EventBus';
import { EventType } from '../events/Events';
import { Recipe } from './models';
import { deleteRecipe } from './recipeApi';

interface DeleteRecipeDialogueProps {
    show: boolean
    onHide: () => void
    recipe: Recipe
}

const DeleteRecipeDialogue: React.FC<DeleteRecipeDialogueProps> = ({ show, onHide, recipe }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');

    async function handleDelete() {
        setIsDeleting(true);
        try {
            await deleteRecipe(recipe.path);
            setIsDeleting(false);
        } catch (error) {
            setError('Something went wrong, please try again later.');
            console.log(error);
        }

        eventBus.emit<EventType.RECIPE_UPDATED>(EventType.RECIPE_UPDATED, {});
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete recipe "{recipe.metadata.name}"?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button className="d-flex flex-row align-items-center gap-1" variant="danger" onClick={handleDelete}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                    {isDeleting && <Spinner size="sm" animation="border" />}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteRecipeDialogue;