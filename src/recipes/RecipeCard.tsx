import React from 'react';
import { Col } from 'react-bootstrap';
import DeleteRecipeDialogue from './DeleteRecipeDialogue';
import RecipeCardView from './RecipeCardView';
import RecipeDialogue from './RecipeDialogue';
import { Metadata, Recipe } from './models';
import { updateRecipe } from './recipeApi';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const [showEdit, setShowEdit] = React.useState(false);
    const [showDelete, setShowDelete] = React.useState(false);

    function onEditClicked() {
        setShowEdit(true);
    }

    function onDeleteClicked() {
        setShowDelete(true);
    }

    async function onSubmit(metadata: Metadata, recipeFile?: File, thumbnail?: File): Promise<void> {
        await updateRecipe(recipe.path, metadata, recipeFile, thumbnail);
    }

    function onSuccess(): void {
        setShowEdit(false);
    }

    return (
        <Col xs={6} sm={4} md={3} xl={2} className="d-flex justify-content-xs-center mb-4">
            <RecipeCardView recipe={recipe} onEditClicked={onEditClicked} onDeleteClicked={onDeleteClicked} />
            {showEdit && <RecipeDialogue
                title={"Edit recipe"}
                currentRecipe={recipe}
                show={showEdit}
                onSubmit={onSubmit}
                onSuccess={onSuccess}
                onHide={() => setShowEdit(false)} />
            }
            {showDelete && <DeleteRecipeDialogue
                show={showDelete}
                recipe={recipe}
                onHide={() => setShowDelete(false)}
            />}
        </Col>
    );
};

export default RecipeCard;