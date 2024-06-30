import React from 'react';
import { Recipe } from '../recipes/models';
import Tags from './Tags';

interface PopularTagsProps {
    recipes: Recipe[];
}

const PopularTags: React.FC<PopularTagsProps> = ({ recipes }) => {
    const allTags: string[] = [];

    recipes.forEach(recipe => {
        recipe.metadata.tags.forEach(tag => {
            allTags.push(tag);
        });
    });

    const tagCounts: { [tag: string]: number } = {};

    allTags.forEach(tag => {
        if (tagCounts[tag]) {
            tagCounts[tag]++;
        } else {
            tagCounts[tag] = 1;
        }
    });

    const tagsSortedByPopularity = Object.keys(tagCounts)
        .sort((a, b) => tagCounts[b] - tagCounts[a])
        .sort((a, b) => a.localeCompare(b))

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <span>Popular tags:</span>
            <Tags tags={tagsSortedByPopularity} />

        </div>
    );
};

export default PopularTags;