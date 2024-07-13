import React from 'react';
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import Tags from '../tags/Tags';
import { Recipe } from './models';
import PlaceholderImage from './PlaceholderImage';

interface RecipeCardViewProps {
    recipe: Recipe;
    onEditClicked: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onDeleteClicked: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const RecipeCardView: React.FC<RecipeCardViewProps> = ({ recipe, onEditClicked, onDeleteClicked }) => {

    const openRecipe = () => {
        window.open(recipe.recipeFileUrl, '_blank');
    };

    return (
        <Card
            className="d-flex col-5 col-sm-4 col-md-3 col-lg-2"
            style={{ cursor: 'pointer' }}
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
                <div className="d-flex flex-row gap-2">
                    <Button className={'d-flex flex-row align-items-center gap-2'} variant="btn btn-primary" onClick={(event) => { onEditClicked(event) }}>
                        Edit
                        <BsFillPencilFill />
                    </Button>
                    <Button className={'d-flex flex-row align-items-center gap-2'} variant="btn btn-danger" onClick={(event) => { onDeleteClicked(event) }}>
                        Delete
                        <BsFillTrashFill />
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default RecipeCardView;