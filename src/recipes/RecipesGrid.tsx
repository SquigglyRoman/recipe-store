import React from 'react';
import RecipeCard from './RecipeCard';
import { matches } from './filter';
import { Recipe } from './models';

interface Props {
    recipes: Recipe[]
    searchTokens: string[]
    selectedTags: string[]
    onUpdate: () => void
}

const RecipesGrid: React.FC<Props> = ({ recipes, searchTokens, selectedTags }) => {
    
    return (
        <div className="d-flex gap-4 flex-wrap">
            {recipes
                .filter(recipe => matches(recipe, searchTokens, selectedTags))
                .map(recipe => (
                    <RecipeCard key={recipe.metadata.name} recipe={recipe} />
                ))}
        </div>
    );
};

export default RecipesGrid;