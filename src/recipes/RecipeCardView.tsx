import React from 'react';
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Tags from '../tags/Tags';
import PlaceholderImage from '../resources/placeholder.jpg';
import { Recipe } from './models';

interface RecipeCardViewProps {
    recipe: Recipe;
    onClickEdit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const RecipeCardView: React.FC<RecipeCardViewProps> = ({ recipe, onClickEdit }) => {
    const openRecipe = () => {
        window.open(recipe.fileUrl, '_blank');
    };
    return (
        <Card className="d-flex col-5 col-sm-4 col-md-3 col-lg-2" style={{cursor: 'pointer'}} onClick={openRecipe}>
            <Card.Img className="h-50 object-fit-cover" variant="top" src={recipe.imageUrl ?? PlaceholderImage} />
            <Card.Body>
                <Card.Title>
                    <span>{recipe.metadata.name}</span>
                </Card.Title>
                <Card.Text>
                    <Tags tags={recipe.metadata.tags} />
                </Card.Text>
                <Button style={{marginTop: 'auto'}} onClick={(event) => { onClickEdit(event) }}>Edit recipe</Button>
            </Card.Body>
        </Card>
    );
};

export default RecipeCardView;