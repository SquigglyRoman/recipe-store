import React from 'react';
import { Recipe } from './models';
import { Button, Card } from 'react-bootstrap';

interface RecipeCardEditProps {
    recipe: Recipe;
    onClickSave: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, newRecipe: Recipe) => void;
}

const RecipeCardEdit: React.FC<RecipeCardEditProps> = ({ recipe, onClickSave }) => {

    return (
        <>
            <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
                <p>ToDo</p>
                <Button onClick={event => onClickSave(event, recipe)}> Submit</Button>
            </Card.Body>
        </>
    );
};

export default RecipeCardEdit;