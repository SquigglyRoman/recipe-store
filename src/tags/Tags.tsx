import React from 'react';
import Badge from 'react-bootstrap/Badge';

interface TagsProps {
    tags: string[];
}

const Tags: React.FC<TagsProps> = ({ tags }) => {
    return (
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {tags.map(tag => (
                <Badge key={tag} bg="secondary">{tag}</Badge>
            ))}
        </div>
    );
};

export default Tags;