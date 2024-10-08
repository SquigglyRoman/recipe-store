import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { BsPlus } from 'react-icons/bs';
import { Metadata } from './models';
import { uploadNewRecipe } from './recipeApi';
import RecipeDialogue from './RecipeDialogue';

const AddRecipe: React.FC = () => {
    const [showDialogue, setShowDialogue] = useState(false);

    async function onSave(metadata: Metadata, recipeFile?: File, thumbnail?: File): Promise<void> {
        if (!recipeFile) {
            return Promise.reject('Recipe file is required');
        }
        await uploadNewRecipe(metadata, recipeFile, thumbnail);
    }

    return (
        <div>
            <Button className="d-flex flex-row align-items-center gap-1" variant="outline-primary" onClick={() => setShowDialogue(true)}>
                Add Recipe
                <BsPlus />
            </Button>
            <RecipeDialogue
                title={'Add new recipe'}
                show={showDialogue}
                onHide={() => setShowDialogue(false)}
                onSave={onSave}
                recipeFileIsMandatory />
        </div>
    );
};

export default AddRecipe;