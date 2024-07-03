import React, { useState } from 'react';
import { Recipe } from './models';
import { Button, Card, Form } from 'react-bootstrap';
import RecipeImage from './RecipeImage';
import eventBus from '../events/EventBus';
import { EventType } from '../events/Events';
import { updateMetadata } from './recipeApi';
import RemovableTags from '../tags/RemovableTags';

interface RecipeCardEditProps {
    recipe: Recipe;
}

const RecipeCardEdit: React.FC<RecipeCardEditProps> = ({ recipe }) => {
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

    function removeTag(tag: string): void {
        setNewTags(newTags.filter(t => t !== tag));
    }

    return (
        <Card style={{ flex: 1, minWidth: '10rem', maxWidth: '14rem', height: '24rem' }}>
            <RecipeImage recipe={recipe} />
            <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
                <Card.Title>
                    <Form.Control onChange={event => setNewRecipeName(event.target.value)} value={newRecipeName}></Form.Control>
                </Card.Title>
                <Card.Text>
                    <RemovableTags tags={newTags} onClick={removeTag}/>
                </Card.Text>
                <Button onClick={onSave} style={{ marginTop: 'auto' }}>{isSaving ? 'Saving changes...' : ' Save changes'}</Button>
            </Card.Body>
        </Card>
    );
};

export default RecipeCardEdit;