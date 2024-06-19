import { Recipe } from "./models";

export function isMatchedByAnySearchToken(searchTokens: string[], recipe: Recipe): boolean {
    if (!searchTokens.length) {
        return true;
    }

    const recipeTokens = [recipe.metadata.name, ...recipe.metadata.tags]
        .map(token => token.toLowerCase());

    return searchTokens
        .map(searchToken => searchToken.toLowerCase())
        .every(searchToken => recipeTokens.some(recipeToken => recipeToken.includes(searchToken)));
}