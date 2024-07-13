import React from 'react';
import Card from 'react-bootstrap/Card';
import Tags from '../tags/Tags';
import { Recipe } from './models';
import PlaceholderImage from './PlaceholderImage';
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
            className="d-flex"
            style={{ width: '14rem', cursor: 'pointer' }}
            onClick={openRecipe}
        >
            <Card.Img className="object-fit-cover" variant="top" style={{ minHeight: '40%', maxHeight: '40%' }} src={recipe.thumbnailUrl ?? PlaceholderImage} />
            <Card.Body className="d-flex flex-column">
                <Card.Title>
                    <span>{recipe.metadata.name}</span>
                </Card.Title>
                <Card.Text className="flex-grow-1">
                    <Tags tags={recipe.metadata.tags} />
                </Card.Text>
                <RecipeActions onEditClicked={onEditClicked} onDeleteClicked={onDeleteClicked}/>
            </Card.Body>
        </Card>
    );
};

export default RecipeCardView;