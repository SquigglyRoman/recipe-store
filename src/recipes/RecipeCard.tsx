import React from 'react';
import Card from 'react-bootstrap/Card';
import eventBus from '../events/EventBus';
import { EventType } from '../events/Events';
import RecipeCardEdit from './RecipeCardEdit';
import RecipeCardView from './RecipeCardView';
import { Recipe } from './models';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const [mode, setMode] = React.useState<'view' | 'edit'>('view');


    function onEditClicked(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();
        setMode('edit');
    }

    eventBus.subscribe(EventType.RECIPE_UPDATED, async () => {
        setMode('view');
    });

    return (
        <Card style={{ flex: 1, minWidth: '10rem', maxWidth: '14rem', height: '24rem' }} >
            {mode === 'view' && <RecipeCardView recipe={recipe} onClickEdit={onEditClicked} />}
            {mode === 'edit' && <RecipeCardEdit recipe={recipe} />}
        </Card >
    );
};

export default RecipeCard;