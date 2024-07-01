import React from 'react';
import Card from 'react-bootstrap/Card';
import PlaceholderImage from '../resources/placeholder.jpg';
import Tags from '../tags/Tags';
import { Recipe } from './models';
import { Button } from 'react-bootstrap';
import { updateMetadata } from './recipeApi';
import RecipeCardView from './RecipeCardView';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const [mode, setMode] = React.useState<'view' | 'edit'>('view');
    const openRecipe = () => {
        window.open(recipe.fileUrl, '_blank');
    };

    function onEditClicked(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();
        setMode('edit');
    }

    return (
        <Card onClick={openRecipe} style={{ flex: 1, minWidth: '10rem', maxWidth: '14rem', height: '24rem', cursor: 'pointer' }} >
            {mode === 'view' && <RecipeCardView recipe={recipe} onClickEdit={onEditClicked}/>}
            {mode === 'edit' && <p>ToDo</p>}
        </Card >
    );
};

export default RecipeCard;