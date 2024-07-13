import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { BsPlus } from 'react-icons/bs';
import AddRecipeDialogue from './AddRecipeDialogue';

const AddRecipe: React.FC = () => {
    const [showDialogue, setShowDialogue] = useState(false);

    return (
        <div>
            <Button className="d-flex flex-row align-items-center gap-1" variant="outline-primary" onClick={() => setShowDialogue(true)}>
                Add Recipe
                <BsPlus />
            </Button>
            <AddRecipeDialogue show={showDialogue} onHide={() => setShowDialogue(false)} />
        </div>
    );
};

export default AddRecipe;