import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Tags from '../tags/Tags';
import PlaceholderImage from '../resources/placeholder.jpg';
import { Recipe } from './models';
import { BsFillPencilFill } from "react-icons/bs";

interface RecipeCardViewProps {
    recipe: Recipe;
    onClickEdit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const RecipeCardView: React.FC<RecipeCardViewProps> = ({ recipe, onClickEdit }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const openRecipe = () => {
        window.open(recipe.fileUrl, '_blank');
    };

    return (
        <Card
            className="d-flex col-5 col-sm-4 col-md-3 col-lg-2"
            style={{ cursor: 'pointer' }}
            onClick={openRecipe}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card.Img className="h-50 object-fit-cover" variant="top" src={recipe.imageUrl ?? PlaceholderImage} />
            <Card.Body className="d-flex flex-column">
                <Card.Title>
                    <span>{recipe.metadata.name}</span>
                </Card.Title>
                <Card.Text className="flex-grow-1">
                    <Tags tags={recipe.metadata.tags} />
                </Card.Text>
                <div className="d-flex flex-row gap-2">
                    <Button className={'d-flex flex-row align-items-center gap-2'} variant="btn btn-outline-primary" onClick={(event) => { onClickEdit(event) }}>
                        Edit
                        <BsFillPencilFill />
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default RecipeCardView;