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
    const [showEdit, setShowEdit] = React.useState(false);


    function onEditClicked(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();
        setShowEdit(true);
    }

    eventBus.subscribe(EventType.RECIPE_UPDATED, async () => {
        setShowEdit(false);
    });

    return (
        <>
            <RecipeCardView recipe={recipe} onClickEdit={onEditClicked} />
            {showEdit && <RecipeCardEdit recipe={recipe} show={showEdit} onHide={() => setShowEdit(false)}/>}
        </>
    );
};

export default RecipeCard;