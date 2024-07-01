import React from 'react';
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Tags from '../tags/Tags';
import RecipeImage from './RecipeImage';
import { Recipe } from './models';

interface RecipeCardViewProps {
    recipe: Recipe;
    onClickEdit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const RecipeCardView: React.FC<RecipeCardViewProps> = ({ recipe, onClickEdit }) => {
    return (
        <>
            <RecipeImage recipe={recipe} />
            <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
                <Card.Title>
                    <span>{recipe.metadata.name}</span>
                </Card.Title>
                <Card.Text>
                    <Tags tags={recipe.metadata.tags} />
                </Card.Text>
                <Button onClick={(event) => {onClickEdit(event)}}>Update</Button>
            </Card.Body>
        </>
    );
};

export default RecipeCardView;