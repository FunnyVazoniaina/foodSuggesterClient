import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Layout from '../components/Layout';
import RecipeCard from '../components/RecipeCard';
import { recipeService } from '../services/api';

const commonIngredients = [
  'tomato', 'potato', 'onion', 'garlic', 'chicken', 'beef', 'pork', 'rice', 
  'pasta', 'cheese', 'milk', 'egg', 'butter', 'olive oil', 'flour', 'sugar',
  'salt', 'pepper', 'carrot', 'broccoli', 'spinach', 'lettuce', 'cucumber',
  'bell pepper', 'mushroom', 'lemon', 'lime', 'orange', 'apple', 'banana'
];

const SearchPage: React.FC = () => {
  const [ingredient, setIngredient] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);

  const handleAddIngredient = () => {
    if (ingredient && !ingredients.includes(ingredient.toLowerCase())) {
      setIngredients([...ingredients, ingredient.toLowerCase()]);
      setIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ing => ing !== ingredientToRemove));
  };

  const handleSearch = async () => {
    if (ingredients.length === 0) return setError('Veuillez ajouter au moins un ingrédient');
    setLoading(true); setError('');
    try {
      const data = await recipeService.suggestRecipes(ingredients.join(','));
      const favoritesData = await recipeService.getFavorites();
      const favoriteIds = favoritesData.map((fav: any) => fav.id);
      setFavorites(favoriteIds);
      setRecipes(data.map((recipe: any) => ({ ...recipe, isFavorite: favoriteIds.includes(recipe.id) })));
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la recherche de recettes');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      const favoritesData = await recipeService.getFavorites();
      const favoriteIds = favoritesData.map((fav: any) => fav.id);
      setFavorites(favoriteIds);
      setRecipes(recipes.map(r => ({ ...r, isFavorite: favoriteIds.includes(r.id) })));
    } catch (err) {
      console.error('Erreur favoris', err);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-[#4A4238] flex items-center gap-2 mb-3">
          <Icon icon="mdi:magnify" className="text-[#FF6B35]" />
          Recherche de recettes
        </h1>
        <p className="text-[#4A4238]/80 mb-4">Entrez les ingrédients que vous avez pour découvrir des recettes délicieuses.</p>
        <div className="bg-white p-4 rounded-2xl shadow mb-6">
          <h2 className="text-lg font-semibold text-[#4A4238] mb-3">Quels ingrédients avez-vous ?</h2>
          <div className="flex mb-3 gap-2">
            <input 
              value={ingredient} 
              onChange={e => setIngredient(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddIngredient()}
              placeholder="Ajouter un ingrédient"
              className="flex-grow px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            />
            <button 
              onClick={handleAddIngredient} 
              disabled={!ingredient}
              className="flex items-center gap-1 px-4 py-2 bg-[#FF6B35] text-white rounded-lg shadow hover:bg-[#ff5a25] disabled:bg-[#ff6b3544]"
            >
              <Icon icon="mdi:plus" /> Ajouter
            </button>
          </div>

          <div className="flex flex-wrap gap-2 p-2 bg-[#FFF9EC] rounded-lg border border-dashed border-[#4A423820] min-h-[50px]">
            {ingredients.length > 0 ? ingredients.map((ing, i) => (
              <span 
                key={i} 
                className="bg-[#FF6B351A] text-[#FF6B35] px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {ing}
                <button onClick={() => handleRemoveIngredient(ing)} className="hover:text-red-600">
                  <Icon icon="mdi:close-circle" className="text-[#FF6B35]" />
                </button>
              </span>
            )) : (
              <p className="italic text-[#4A4238]/60 w-full text-center">Aucun ingrédient ajouté. Commencez à ajouter vos ingrédients !</p>
            )}
          </div>

          <button 
            onClick={handleSearch} 
            disabled={ingredients.length === 0 || loading}
            className="w-full mt-4 py-3 bg-[#FF6B35] text-white rounded-lg shadow text-lg font-medium hover:bg-[#ff5a25] disabled:bg-[#ff6b3544]"
          >
            <div className="flex justify-center items-center gap-2">
              <Icon icon="mdi:magnify" />
              Rechercher des recettes
            </div>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-[#FF6B35] border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-[#4A4238]/80">Recherche de recettes en cours...</p>
          </div>
        ) : recipes.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-[#4A4238] flex items-center gap-2 mb-1">
              <Icon icon="mdi:silverware-fork-knife" className="text-[#FF6B35]" /> Résultats ({recipes.length})
            </h2>
            <p className="text-[#4A4238]/70 mb-4">Voici les recettes que vous pouvez préparer avec vos ingrédients.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} onFavoriteToggle={handleFavoriteToggle} />
              ))}
            </div>
          </div>
        ) : ingredients.length > 0 && !loading ? (
          <div className="text-center py-10">
            <Icon icon="mdi:silverware-fork-knife" className="text-5xl text-[#4A4238]/30 mb-3" />
            <h3 className="text-xl text-[#4A4238]/70 font-medium mb-1">Aucune recette trouvée</h3>
            <p className="text-[#4A4238]/60 max-w-md mx-auto">Essayez d'ajouter d'autres ingrédients ou de modifier votre sélection.</p>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default SearchPage;