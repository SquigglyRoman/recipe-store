import React from 'react';
import { Recipe } from '../recipes/models';
import Tags from './Tags';

interface PopularTagsProps {
    recipes: Recipe[]
    selectedTags: string[]
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
}

const PopularTags: React.FC<PopularTagsProps> = ({ recipes, selectedTags, setSelectedTags }) => {
    const allTagNames: string[] = [];

    recipes.forEach(recipe => {
        recipe.metadata.tags.forEach(tag => {
            allTagNames.push(tag);
        });
    });

    const tagCounts: { [tagName: string]: number } = {};

    allTagNames.forEach(tag => {
        if (tagCounts[tag]) {
            tagCounts[tag]++;
        } else {
            tagCounts[tag] = 1;
        }
    });

    const tagsSortedByPopularity = Object.keys(tagCounts)
        .sort((a, b) => tagCounts[b] - tagCounts[a])
        .sort((a, b) => a.localeCompare(b))

    function handleTagClicked(tag: string): void {
        if (selectedTags.map(selectedTag => selectedTag).includes(tag)) {
            return setSelectedTags(selectedTags.filter(t => t !== tag));
        }
        setSelectedTags([...selectedTags, tag]);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <span>Popular tags:</span>
            <Tags tags={tagsSortedByPopularity} selectedTags={selectedTags} onClick={handleTagClicked} />
        </div>
    );
};

export default PopularTags;