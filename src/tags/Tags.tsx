import React from 'react';
import Badge from 'react-bootstrap/Badge';

interface TagsProps {
    tags: string[];
    selectedTags?: string[];
    onClick?: (tag: string) => void;
}

const Tags: React.FC<TagsProps> = ({ tags, selectedTags, onClick }) => {
    return (
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {tags.map(tag => (
                <Badge key={tag} bg={selectedTags?.includes(tag) ? 'primary' : 'secondary'} onClick={_ => onClick && onClick(tag)} style={{cursor: onClick ? 'pointer' : 'auto'}}>{tag}</Badge>
            ))}
        </div>
    );
};

export default Tags;