import React from 'react';
import AddOrEditRecipeDialogue from './AddOrEditRecipeDialogue';
import RecipeCardView from './RecipeCardView';
import { Metadata, Recipe } from './models';
import { updateRecipe } from './recipeApi';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const [showEdit, setShowEdit] = React.useState(false);


    function onEditClicked(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();
        setShowEdit(true);
    }

    async function onSave(metadata: Metadata, recipeFile?: File, thumbnail?: File): Promise<void> {
        await updateRecipe(recipe.path, metadata, recipeFile, thumbnail);
    }

    return (
        <>
            <RecipeCardView recipe={recipe} onClickEdit={onEditClicked} />
            {showEdit && <AddOrEditRecipeDialogue
                title={"Edit recipe"}
                currentRecipe={recipe}
                show={showEdit}
                onSave={onSave}
                onHide={() => setShowEdit(false)} />
            }
        </>
    );
};

export default RecipeCard;