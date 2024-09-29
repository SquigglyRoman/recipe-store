import React, { useEffect, useState } from 'react';
import { Row, Spinner } from 'react-bootstrap';
import eventBus from '../events/EventBus';
import { EventType } from '../events/Events';
import RecipeCard from './RecipeCard';
import { matches } from './filter';
import { Recipe } from './models';
import { getAllRecipes } from './recipeApi';

interface Props {
    searchTokens: string[]
    selectedTags: string[]
}

const RecipesGrid: React.FC<Props> = ({ searchTokens, selectedTags }) => {

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        eventBus.subscribe<EventType.RECIPE_UPDATED>(EventType.RECIPE_UPDATED, loadRecipes);
        loadRecipes();
    }, []);

    async function loadRecipes() {
        setIsLoading(true);
        const recipes = await getAllRecipes();
        setRecipes(recipes);
        eventBus.emit<EventType.RECIPES_LOADED>(EventType.RECIPES_LOADED, { recipes });
        setIsLoading(false);
    }
    return (
        <>
            {isLoading ?
                (<div className='d-flex flex-row gap-3'>
                    Loading recipes...
                    <Spinner animation="border" />
                </div>) :
                (<Row>
                    {recipes
                        .filter(recipe => matches(recipe.metadata, searchTokens, selectedTags))
                        .sort((a, b) => a.metadata.name.localeCompare(b.metadata.name))
                        .map(recipe => (
                            <RecipeCard key={recipe.metadata.name} recipe={recipe} />
                        ))}
                </Row >)}
        </>
    );
};

export default RecipesGrid;