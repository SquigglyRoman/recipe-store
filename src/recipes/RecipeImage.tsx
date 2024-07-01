import React from 'react';
import Card from 'react-bootstrap/Card';
import PlaceholderImage from '../resources/placeholder.jpg';
import { Recipe } from './models';

interface RecipeImageProps {
    recipe: Recipe;
}

const RecipeImage: React.FC<RecipeImageProps> = ({ recipe }) => {
    return (
        <Card.Img style={{ maxHeight: '45%', minHeight: '45%', objectFit: 'cover' }} variant="top" src={recipe.imageUrl ?? PlaceholderImage} />
    );
};

export default RecipeImage;