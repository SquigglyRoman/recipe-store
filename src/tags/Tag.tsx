import React from 'react';
import Badge from 'react-bootstrap/Badge';

interface TagsProps {
    name: string;
    isSelected: boolean;
    onClick?: (tag: string) => void;
}

const Tags: React.FC<TagsProps> = ({ name, isSelected, onClick }) => {
    return (
        <Badge
            className="user-select-none overflow-hidden"
            bg={isSelected ? 'primary' : 'secondary'}
            onClick={_ => onClick && onClick(name)}
            style={{ cursor: onClick ? 'pointer' : 'auto', textOverflow: 'ellipsis'}}>
            {name}
        </Badge>
    );
};

export default Tags;