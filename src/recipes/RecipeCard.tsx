import React from 'react';
import Card from 'react-bootstrap/Card';
import { Recipe } from './models';
import { Badge, Button } from 'react-bootstrap';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    return (
        <Card style={{flex: 1, minWidth: '18rem'}} >
            <Card.Img variant="top" src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
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