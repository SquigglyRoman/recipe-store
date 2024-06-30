import { Recipe } from "./models";

export function matches(recipe: Recipe, searchTokens: string[], selectedTags: string[]): boolean {
    return isPartiallyMatchedByAnySearchToken(searchTokens, recipe) && isFullyMatchedByAllTags(recipe, selectedTags);
}

function isPartiallyMatchedByAnySearchToken(searchTokens: string[], recipe: Recipe): boolean {
    if (!searchTokens.length) {
        return true;
    }

    const recipeTokens = [recipe.metadata.name, ...recipe.metadata.tags]
        .map(token => token.toLowerCase());

    return searchTokens
        .map(searchToken => searchToken.toLowerCase())
        .every(searchToken => recipeTokens.some(recipeToken => recipeToken.includes(searchToken)));
}

function isFullyMatchedByAllTags(recipe: Recipe, selectedTags: string[]) {
    if (!selectedTags.length) {
        return true;
    }

    return selectedTags.every(selectedTag => recipe.metadata.tags.includes(selectedTag));
}
