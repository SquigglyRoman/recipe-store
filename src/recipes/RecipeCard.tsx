import React from 'react';
import { Button } from 'react-bootstrap';
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
        <Card onClick={openRecipe} style={{ flex: 1, minWidth: '12rem', maxWidth: '16rem', cursor: 'pointer' }} >
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