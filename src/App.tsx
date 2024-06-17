import { useEffect, useState } from 'react';
import { Recipe } from './recipes/models';
import { getAllRecipes } from './recipes/recipeApi';
import RecipeCard from './recipes/RecipeCard';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    getAllRecipes().then(setRecipes);
  }, []);

  return (
    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
      {recipes.map(recipe => (
        <RecipeCard recipe={recipe} />
      ))}
    </div>
  );
}

export default App;
