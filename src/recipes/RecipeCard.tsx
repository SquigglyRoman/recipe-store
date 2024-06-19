import React from 'react';
import Card from 'react-bootstrap/Card';
import { Recipe } from './models';
import { Badge, Button } from 'react-bootstrap';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    return (
        <Card style={{flex: 1, minWidth: '12rem', maxWidth: '24rem'}} >
            <Card.Img variant="top" src={recipe.imageUrl} />
            <Card.Body>
                <Card.Title>{recipe.metadata.name}</Card.Title>
                <Card.Text>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {recipe.metadata.tags.map(tag => (
                            <Badge key={tag} bg="secondary">{tag}</Badge>
                        ))}
                    </div>
                </Card.Text>
                <a href={recipe.fileUrl}>
                    <Button>Show recipe</Button>
                </a>
            </Card.Body>
        </Card>
    );
};

export default RecipeCard;