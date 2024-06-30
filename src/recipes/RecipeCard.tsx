import React from 'react';
import Card from 'react-bootstrap/Card';
import { Recipe } from './models';
import { Badge, Button } from 'react-bootstrap';
import PlaceholderImage from '../resources/placeholder.jpg'
import Tags from '../tags/Tags';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    return (
        <Card style={{ flex: 1, minWidth: '12rem', maxWidth: '24rem' }} >
            <Card.Img style={{ height: '60%', objectFit: 'cover' }} variant="top" src={recipe.imageUrl ?? PlaceholderImage} />
            <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
                <Card.Title>{recipe.metadata.name}</Card.Title>
                <Card.Text>
                    <Tags tags={recipe.metadata.tags} />
                </Card.Text>
            </Card.Body>
            <a style={{ padding: '1rem' }} href={recipe.fileUrl}>
                <Button>Show recipe</Button>
            </a>
        </Card>
    );
};

export default RecipeCard;