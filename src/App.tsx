import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Login from './auth/Login';
import { checkIfAuthorizedFromCookie } from './auth/authChecker';
import RecipesGrid from './recipes/RecipesGrid';
import { Recipe } from './recipes/models';
import { getAllRecipes } from './recipes/recipeApi';
import Search from './search/search';
import PopularTags from './tags/PopularTags';
import { Spinner } from 'react-bootstrap';

function App() {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTokens, setSearchTokens] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    checkIfAuthorizedFromCookie().then((authStatus) => {
      setIsAuthorized(authStatus);
    });
  }, []);

  useEffect(() => {
    isAuthorized && getAllRecipes().then(setRecipes).then(() => setIsLoading(false));
  }, [isAuthorized]);

  return (
    <>
      {isLoading ? (
        <Spinner animation="border" />
      ) : isAuthorized ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Search setSearchTokens={setSearchTokens} />
          <PopularTags recipes={recipes} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
          <RecipesGrid searchTokens={searchTokens} selectedTags={selectedTags} recipes={recipes} />
        </div>
      ) : (
        <Login setIsAuthorized={setIsAuthorized} />
      )}
    </>
  );
}

export default App;
