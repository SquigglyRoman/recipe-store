import React from 'react';
import InteractableTag from './InteractableTag';

interface RemovableTagsProps {
    tags: string[];
}

const RemovableTags: React.FC<RemovableTagsProps> = ({ tags }) => {

    return (
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {tags.map(tag => (
                <InteractableTag tagName={tag} onClick={console.log}></InteractableTag>
            ))}
        </div>
    );
};

export default RemovableTags;