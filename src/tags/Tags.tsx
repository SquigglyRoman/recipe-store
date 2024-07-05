import React from 'react';
import Tag from './Tag';

interface TagsProps {
    tags: string[];
    selectedTags?: string[];
    onClick?: (tag: string) => void;
}

const Tags: React.FC<TagsProps> = ({ tags, selectedTags, onClick }) => {
    return (
        <div className="d-flex gap-1 flex-wrap">
            {tags.map(tag => (
                <Tag key={tag} name={tag} isSelected={selectedTags?.includes(tag) ?? false} onClick={onClick}/>
            ))}
        </div>
    );
};

export default Tags;