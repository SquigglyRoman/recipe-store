import React, { useEffect, useState } from 'react';
import eventBus from '../events/EventBus';
import { EventType, RecipesLoadedEvent } from '../events/Events';
import { Recipe } from '../recipes/models';
import Tags from './Tags';

interface PopularTagsProps {
    selectedTags: string[]
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
}

const PopularTags: React.FC<PopularTagsProps> = ({ selectedTags, setSelectedTags }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const allTagNames: string[] = [];

    useEffect(() => {
        eventBus.subscribe<EventType.RECIPES_LOADED>(EventType.RECIPES_LOADED, (args: RecipesLoadedEvent) => {
            setRecipes(args.recipes);
        });
    }, []);

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

    const popularTags = Object.keys(tagCounts)
        .sort((a, b) => a.localeCompare(b))
        .sort((a, b) => tagCounts[b] - tagCounts[a])
        .slice(0, 8);

    function handleTagClicked(tag: string): void {
        if (selectedTags.map(selectedTag => selectedTag).includes(tag)) {
            return setSelectedTags(selectedTags.filter(t => t !== tag));
        }
        setSelectedTags([...selectedTags, tag]);
    }

    return (
        <div className="d-flex flex-row gap-2">
            <span>Popular tags:</span>
            <Tags tags={popularTags} selectedTags={selectedTags} onClick={handleTagClicked} />
        </div>
    );
};

export default PopularTags;