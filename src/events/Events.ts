import { Recipe } from "../recipes/models";

export enum EventType {
    RECIPES_LOADED = "RECIPES_LOADED",
    RECIPE_UPDATED = "RECIPE_UPDATED",
    USER_AUTHORIZED = "USER_AUTHORIZED"
}

export type RecipeUpdatedEvent = {}

export type UserAuthorizedEvent = {}

export type RecipesLoadedEvent = {recipes: Recipe[]}

export interface EventArguments {
    [EventType.RECIPE_UPDATED]: RecipeUpdatedEvent;
    [EventType.RECIPES_LOADED]: RecipesLoadedEvent;
    [EventType.USER_AUTHORIZED]: UserAuthorizedEvent;
}