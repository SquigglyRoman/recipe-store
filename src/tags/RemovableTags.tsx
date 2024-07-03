import React from 'react';
import InteractableTag from './InteractableTag';

interface RemovableTagsProps {
    tags: string[];
    onClick: (tag: string) => void;
}

const RemovableTags: React.FC<RemovableTagsProps> = ({ tags, onClick}) => {

    return (
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {tags.map(tag => (
                <InteractableTag tagName={tag} onClick={onClick}></InteractableTag>
            ))}
        </div>
    );
};

export default RemovableTags;