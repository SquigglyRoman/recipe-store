import React from 'react';
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import PlaceholderImage from '../resources/placeholder.jpg';
import Tags from '../tags/Tags';
import { Recipe } from './models';

interface RecipeCardViewProps {
    recipe: Recipe;
    onClickEdit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const RecipeCardView: React.FC<RecipeCardViewProps> = ({ recipe, onClickEdit }) => {
    return (
        <>
            <Card.Img style={{ maxHeight: '45%', minHeight: '45%', objectFit: 'cover' }} variant="top" src={recipe.imageUrl ?? PlaceholderImage} />
            <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
                <Card.Title>
                    <span>{recipe.metadata.name}</span>
                    <Button variant="link" className="edit-button" style={{ visibility: 'hidden' }}>Edit</Button>
                </Card.Title>
                <Card.Text>
                    <Tags tags={recipe.metadata.tags} />
                </Card.Text>
                <Button onClick={(event) => {onClickEdit(event)}}>Update</Button>
            </Card.Body>
        </>
    );
};

export default RecipeCardView;