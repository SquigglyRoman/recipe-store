import { Metadata, Recipe } from "./models";

export function matches(metadata: Metadata, searchTokens: string[], selectedTags: string[]): boolean {
    return isPartiallyMatchedByAnySearchToken(searchTokens, metadata) && isFullyMatchedByAllTags(metadata, selectedTags);
}

function isPartiallyMatchedByAnySearchToken(searchTokens: string[], metadata: Metadata): boolean {
    if (!searchTokens.length) {
        return true;
    }

    const recipeTokens = [metadata.name, ...metadata.tags]
        .map(token => token.toLowerCase());

    return searchTokens
        .map(searchToken => searchToken.toLowerCase())
        .every(searchToken => recipeTokens.some(recipeToken => recipeToken.includes(searchToken)));
}

function isFullyMatchedByAllTags(metadata: Metadata, selectedTags: string[]) {
    if (!selectedTags.length) {
        return true;
    }

    return selectedTags.every(selectedTag => metadata.tags.includes(selectedTag));
}
