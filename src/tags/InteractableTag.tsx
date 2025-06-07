import React, { useState } from 'react';
import { Badge } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';

interface InteractableTagProps {
    tagName: string;
    onClick: (tag: string) => void;
}

const InteractableTag: React.FC<InteractableTagProps> = ({ tagName, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleClick = () => {
        onClick(tagName);
    };

    return (
        <Badge
            pill
            bg={isHovered ? 'danger' : 'primary'}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            {tagName} {isHovered && <FaTimes />}
        </Badge>
    );
};

export default InteractableTag;