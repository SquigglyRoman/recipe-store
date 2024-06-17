import React from 'react';
import Card from 'react-bootstrap/Card';
import { Recipe } from './models';
import { Badge } from 'react-bootstrap';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
            <Card.Body>
                <Card.Title>{recipe.metadata.name}</Card.Title>
                <div style={{display: 'flex', gap: '5px'}}>
                {recipe.metadata.tags.map(tag => (
                    <Badge key={tag}>{tag}</Badge>
                ))}
                </div>
            </Card.Body>
        </Card>
    );
};

export default RecipeCard;