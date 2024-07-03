import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Tag from './Tag';

interface TagsProps {
    tags: string[];
    selectedTags?: string[];
    onClick?: (tag: string) => void;
}

const Tags: React.FC<TagsProps> = ({ tags, selectedTags, onClick }) => {
    return (
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {tags.map(tag => (
                <Tag key={tag} name={tag} isSelected={selectedTags?.includes(tag) ?? false} onClick={onClick}/>
            ))}
        </div>
    );
};

export default Tags;