import React from 'react';
import Card from 'react-bootstrap/Card';
import PlaceholderImage from '../resources/PlaceholderImage';
import Tags from '../tags/Tags';
import { Recipe } from './models';
import RecipeActions from './RecipeActions';

interface RecipeCardViewProps {
    recipe: Recipe;
    onEditClicked: () => void;
    onDeleteClicked: () => void;
}

const RecipeCardView: React.FC<RecipeCardViewProps> = ({ recipe, onEditClicked, onDeleteClicked }) => {

    const openRecipe = () => {
        window.open(recipe.recipeFileUrl, '_blank');
    };

    return (
        <Card
            className="flex-grow-1"
            style={{ cursor: 'pointer' }}
            onClick={openRecipe}
        >
            <Card.Img className="object-fit-cover" variant="top" style={{height: '8rem' }} src={recipe.thumbnailUrl ?? PlaceholderImage} />
            <Card.Body className="d-flex flex-column">
                <Card.Title>
                    <span>{recipe.metadata.name}</span>
                </Card.Title>
                <Card.Text className="flex-grow-1">
                    <Tags tags={recipe.metadata.tags} />
                </Card.Text>
                <RecipeActions onEditClicked={onEditClicked} onDeleteClicked={onDeleteClicked} />
            </Card.Body>
        </Card>
    );
};

export default RecipeCardView;