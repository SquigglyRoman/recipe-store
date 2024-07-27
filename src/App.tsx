import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Login from './auth/Login';
import { checkIfAuthorizedFromCookie } from './auth/cookieAuthHandler';
import AddRecipe from './recipes/AddRecipe';
import RecipesGrid from './recipes/RecipesGrid';
import RecipeStoreLogo from './resources/Logo';
import Search from './search/search';
import PopularTags from './tags/PopularTags';

function App() {

  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  
  const [searchTokens, setSearchTokens] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    checkIfAuthorizedFromCookie().then(isAuthorized => {
      isAuthorized && handleIsAuthorized();
    });

  }, []);

  async function handleIsAuthorized() {
    setIsAuthorized(true);
  }

  return (
    <>
      {isAuthorized ? (
        <div className="d-flex flex-column gap-4">
          <div className="d-flex flex-wrap gap-2">
            <RecipeStoreLogo />
            <Search setSearchTokens={setSearchTokens} />
            <AddRecipe />
          </div>
          <PopularTags selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
          <RecipesGrid searchTokens={searchTokens} selectedTags={selectedTags} />
        </div>
      ) : (
        <Login onLoginSuccess={handleIsAuthorized} />
      )}
    </>
  );
}

export default App;
