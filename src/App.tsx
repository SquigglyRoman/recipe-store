import { useEffect, useState } from 'react';
import { Recipe } from './recipes/models';
import { getAllRecipes } from './recipes/recipeApi';

function App() {

  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    getAllRecipes().then(setRecipes);
  }, []);

  return (
    <div>
      {recipes.map(recipe => (
        <div key={recipe.metadata.name}>
          <h2>{recipe.metadata.name}</h2>
          <p>Tags:</p>
          <ul>
            {recipe.metadata.tags.map(tag => (
              <li key={tag}>{tag}</li>
            ))}
            <a href={recipe.fileUrl} >Open recipe</a>
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
