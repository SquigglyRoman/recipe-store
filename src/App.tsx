import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Login from './auth/Login';
import { checkIfAuthorizedFromCookie } from './auth/cookieAuthHandler';
import RecipesGrid from './recipes/RecipesGrid';
import { Recipe } from './recipes/models';
import { getAllRecipes } from './recipes/recipeApi';
import Search from './search/search';
import PopularTags from './tags/PopularTags';
import { Spinner } from 'react-bootstrap';
import eventBus from './events/EventBus';
import { EventType } from './events/Events';
import AddRecipe from './recipes/AddRecipe';
import RecipeStoreLogo from './resources/Logo';

function App() {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTokens, setSearchTokens] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    eventBus.subscribe(EventType.RECIPE_UPDATED, loadRecipes);
    checkIfAuthorizedFromCookie().then(isAuthorized => {
      isAuthorized && handleIsAuthorized();
      setIsLoading(false);
    });

  }, []);

  async function handleIsAuthorized() {
    setIsAuthorized(true);
    loadRecipes();
    setIsLoading(false);
  }

  function loadRecipes() {
    setIsLoading(true);
    getAllRecipes()
      .then(setRecipes)
      .then(() => setIsLoading(false));
  }

  return (
    <>
      {isLoading ? (
        <Spinner animation="border" />
      ) : isAuthorized ? (
        <div className="d-flex flex-column gap-4">
          <div className="d-flex flex-wrap gap-2">
            <RecipeStoreLogo />
            <Search setSearchTokens={setSearchTokens} />
            <AddRecipe />
          </div>
          <PopularTags recipes={recipes} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
          <RecipesGrid searchTokens={searchTokens} selectedTags={selectedTags} recipes={recipes} onUpdate={loadRecipes} />
        </div>
      ) : (
        <Login onLoginSuccess={handleIsAuthorized} />
      )}
    </>
  );
}

export default App;
