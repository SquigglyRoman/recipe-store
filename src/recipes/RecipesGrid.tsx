import React from 'react';
import RecipeCard from './RecipeCard';
import { matches } from './filter';
import { Recipe } from './models';

interface Props {
    recipes: Recipe[]
    searchTokens: string[]
    selectedTags: string[]
}

const RecipesGrid: React.FC<Props> = ({ recipes, searchTokens, selectedTags }) => {
    return (
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
            {recipes
                .filter(recipe => matches(recipe, searchTokens, selectedTags))
                .map(recipe => (
                    <RecipeCard key={recipe.metadata.name} recipe={recipe} />
                ))}
        </div>
    );
};

export default RecipesGrid;