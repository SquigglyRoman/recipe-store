import React from 'react';
import Card from 'react-bootstrap/Card';
import RecipeCardView from './RecipeCardView';
import { Recipe } from './models';
import RecipeCardEdit from './RecipeCardEdit';

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

    function onSaveClicked(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, recipe: Recipe) {
        event.stopPropagation();
        // TODO: Update the recipe
        setMode('view');
    }

    return (
        <Card onClick={openRecipe} style={{ flex: 1, minWidth: '10rem', maxWidth: '14rem', height: '24rem', cursor: 'pointer' }} >
            {mode === 'view' && <RecipeCardView recipe={recipe} onClickEdit={onEditClicked}/>}
            {mode === 'edit' && <RecipeCardEdit recipe={recipe} onClickSave={onSaveClicked} />}
        </Card >
    );
};

export default RecipeCard;