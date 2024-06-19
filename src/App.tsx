import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Recipe } from './recipes/models';
import { getAllRecipes } from './recipes/recipeApi';
import Search from './search/search';
import RecipesGrid from './recipes/RecipesGrid';

function App() {

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTokens, setSearchTokens] = useState<string[]>([]);

  useEffect(() => {
    getAllRecipes().then(setRecipes);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px'}}>
      <Search setSearchTokens={setSearchTokens} />
      <RecipesGrid searchTokens={searchTokens} recipes={recipes} />
    </div>
  );
}

export default App;
