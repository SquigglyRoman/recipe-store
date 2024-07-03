import React, { useState } from 'react';
import { Recipe } from './models';
import { Button, Card, Form } from 'react-bootstrap';
import RecipeImage from './RecipeImage';
import eventBus from '../events/EventBus';
import { EventType } from '../events/Events';
import { updateMetadata } from './recipeApi';

interface RecipeCardEditProps {
    recipe: Recipe;
}

const RecipeCardEdit: React.FC<RecipeCardEditProps> = ({ recipe }) => {
    const [newRecipeName, setNewRecipeName] = useState(recipe.metadata.name);

    async function onSave(): Promise<void> {
        const newRecipe = {
            ...recipe,
            metadata: {
                ...recipe.metadata,
                name: newRecipeName
            }
        }

        await updateMetadata(newRecipe);

        eventBus.emit<EventType.RECIPE_UPDATED>(EventType.RECIPE_UPDATED, { recipe: newRecipe });
        // TODO: Add feedback when successful, e.g. a toast
    }

    return (
        <>
            <RecipeImage recipe={recipe} />
            <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
                <Form.Control onChange={event => setNewRecipeName(event.target.value)} value={newRecipeName}></Form.Control>
            </Card.Body>
            <Button onClick={onSave}>Save changes</Button>
        </>
    );
};

export default RecipeCardEdit;