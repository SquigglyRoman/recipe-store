import React, { useState } from 'react';
import { Badge } from 'react-bootstrap';

interface InteractableTagProps {
    tagName: string;
    onClick: (tag: string) => void;
}

const InteractableTag: React.FC<InteractableTagProps> = ({ tagName, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    const onMouseEnter = () => {
        setIsHovered(true);
    };

    const onMouseLeave = () => {
        setIsHovered(false);
    };

    const handleClick = () => {
        onClick(tagName);
    };

    return (
        <Badge
            pill
            bg={isHovered ? 'danger' : 'primary'}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            {tagName}
        </Badge>
    );
};

export default InteractableTag;