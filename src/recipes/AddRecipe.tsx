import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import AddRecipeDialogue from './AddRecipeDialogue';

const AddRecipe: React.FC = () => {
    const [showDialogue, setShowDialogue] = useState(false);

    return (
        <div>
            <Button variant="outline-primary" onClick={() => setShowDialogue(true)}>
                Add Recipe
            </Button>
            <AddRecipeDialogue show={showDialogue} onHide={() => setShowDialogue(false)} />
        </div>
    );
};

export default AddRecipe;