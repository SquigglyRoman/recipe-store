import React from 'react';
import RecipeCard from './RecipeCard';
import { Recipe } from './models';
import { isMatchedByAnySearchToken } from './filter';

interface Props {
    recipes: Recipe[];
    searchTokens: string[];
}

const RecipesGrid: React.FC<Props> = ({ recipes, searchTokens: searchTokens }) => {
    return (
        <div>
            {recipes
                .filter(recipe => isMatchedByAnySearchToken(searchTokens, recipe))
                .map(recipe => (
                    <RecipeCard key={recipe.metadata.name} recipe={recipe} />
                ))}
        </div>
    );
};

export default RecipesGrid;