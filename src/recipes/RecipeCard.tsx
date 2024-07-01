import React from 'react';
import Card from 'react-bootstrap/Card';
import PlaceholderImage from '../resources/placeholder.jpg';
import Tags from '../tags/Tags';
import { Recipe } from './models';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const openRecipe = () => {
        window.open(recipe.fileUrl, '_blank');
    };

    return (
        <Card onClick={openRecipe} style={{ flex: 1, minWidth: '10rem', maxWidth: '14rem', height: '24rem', cursor: 'pointer' }} >
            <Card.Img style={{ maxHeight: '45%', minHeight: '45%', objectFit: 'cover' }} variant="top" src={recipe.imageUrl ?? PlaceholderImage} />
            <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
                <Card.Title>{recipe.metadata.name}</Card.Title>
                <Card.Text>
                    <Tags tags={recipe.metadata.tags} />
                </Card.Text>
            </Card.Body>
        </Card >
    );
};

export default RecipeCard;