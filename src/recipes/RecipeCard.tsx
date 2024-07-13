import React from 'react';
import AddOrEditRecipeDialogue from './AddOrEditRecipeDialogue';
import RecipeCardView from './RecipeCardView';
import { Metadata, Recipe } from './models';
import { updateRecipe } from './recipeApi';
import DeleteRecipeDialogue from './DeleteRecipeDialogue';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const [showEdit, setShowEdit] = React.useState(false);
    const [showDelete, setShowDelete] = React.useState(false);

    function onEditClicked(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();
        setShowEdit(true);
    }

    function onDeleteClicked(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();
        setShowDelete(true);
    }

    async function onSave(metadata: Metadata, recipeFile?: File, thumbnail?: File): Promise<void> {
        await updateRecipe(recipe.path, metadata, recipeFile, thumbnail);
    }

    return (
        <>
            <RecipeCardView recipe={recipe} onEditClicked={onEditClicked} onDeleteClicked={onDeleteClicked} />
            {showEdit && <AddOrEditRecipeDialogue
                title={"Edit recipe"}
                currentRecipe={recipe}
                show={showEdit}
                onSave={onSave}
                onHide={() => setShowEdit(false)} />
            }
            {showDelete && <DeleteRecipeDialogue
                show={showDelete}
                recipe={recipe}
                onHide={() => setShowDelete(false)}
            />}
        </>
    );
};

export default RecipeCard;