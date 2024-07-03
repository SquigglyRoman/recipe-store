import { Recipe } from "../recipes/models";

export enum EventType {
    RECIPE_UPDATED = "RECIPE_UPDATED",
    USER_AUTHORIZED = "USER_AUTHORIZED"
}

export type RecipeUpdatedEvent = {
    recipe: Recipe;
}

export type UserAuthorizedEvent = {}

export interface EventArguments {
    [EventType.RECIPE_UPDATED]: RecipeUpdatedEvent;
    [EventType.USER_AUTHORIZED]: UserAuthorizedEvent;
}