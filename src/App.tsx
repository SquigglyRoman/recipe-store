import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Recipe } from './recipes/models';
import { getAllRecipes } from './recipes/recipeApi';
import Search from './search/search';
import RecipesGrid from './recipes/RecipesGrid';
import PopularTags from './tags/PopularTags';
import Login from './login/Login';

function App() {

  const [apiToken, setApiToken] = useState<string | undefined>(undefined);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTokens, setSearchTokens] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    apiToken && getAllRecipes().then(setRecipes);
  }, [apiToken]);

  return (
    <>
      {apiToken ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Search setSearchTokens={setSearchTokens} />
          <PopularTags recipes={recipes} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
          <RecipesGrid searchTokens={searchTokens} selectedTags={selectedTags} recipes={recipes} />
        </div>
      ) : (
        <Login setApiToken={setApiToken} />
      )}
    </>
  );
}

export default App;
