import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs';

interface RecipeActionsProps {
    onEditClicked: () => void;
    onDeleteClicked: () => void;
}

const RecipeActions: React.FC<RecipeActionsProps> = ({ onEditClicked, onDeleteClicked }) => {
    const handleActionSelect = (eventKey: string | null) => {
        if (eventKey === 'edit') {
            onEditClicked();
        } else if (eventKey === 'delete') {
            onDeleteClicked();
        }
    };

    function preventRecipeFromOpening(event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    return (
        <Dropdown onSelect={handleActionSelect} onClick={preventRecipeFromOpening}>
            <Dropdown.Toggle variant="outline-primary" id="recipe-actions-dropdown">
                Actions
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item className={'d-flex flex-row align-items-center gap-2'} eventKey="edit">
                    <BsFillPencilFill />
                    Edit
                </Dropdown.Item>
                <Dropdown.Item className={'d-flex flex-row align-items-center gap-2'} eventKey="delete">
                    <BsFillTrashFill />
                    Delete
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default RecipeActions;