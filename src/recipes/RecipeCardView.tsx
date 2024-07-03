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
    const openRecipe = () => {
        window.open(recipe.fileUrl, '_blank');
    };
    return (
        <Card style={{ flex: 1, minWidth: '10rem', maxWidth: '14rem', height: '24rem', cursor: 'pointer'}} onClick={openRecipe}>
            <RecipeImage recipe={recipe} />
            <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
                <Card.Title>
                    <span>{recipe.metadata.name}</span>
                </Card.Title>
                <Card.Text>
                    <Tags tags={recipe.metadata.tags} />
                </Card.Text>
                <Button onClick={(event) => { onClickEdit(event) }}>Edit recipe</Button>
            </Card.Body>
        </Card>
    );
};

export default RecipeCardView;