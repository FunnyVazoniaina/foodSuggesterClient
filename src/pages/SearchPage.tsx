import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Chip, 
  Paper, 
  CircularProgress, 
  Alert,
  Autocomplete,
  useTheme,
  alpha,
  Divider,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Layout from '../components/Layout';
import RecipeCard from '../components/RecipeCard';
import { recipeService } from '../services/api';
import RestaurantIcon from '@mui/icons-material/Restaurant';

interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  likes: number;
  isFavorite?: boolean;
}

const commonIngredients = [
  'tomato', 'potato', 'onion', 'garlic', 'chicken', 'beef', 'pork', 'rice', 
  'pasta', 'cheese', 'milk', 'egg', 'butter', 'olive oil', 'flour', 'sugar',
  'salt', 'pepper', 'carrot', 'broccoli', 'spinach', 'lettuce', 'cucumber',
  'bell pepper', 'mushroom', 'lemon', 'lime', 'orange', 'apple', 'banana'
];

const SearchPage: React.FC = () => {
  const [ingredient, setIngredient] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const theme = useTheme();

  // Couleurs thématiques
  const primaryColor = '#FF6B35'; // Orange chaleureux
  const backgroundColor = '#FFF9EC'; // Beige clair
  const textColor = '#4A4238'; // Brun foncé
  const accentColor = '#2E86AB'; // Bleu pour les accents

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
    if (ingredients.length === 0) {
      setError('Veuillez ajouter au moins un ingrédient');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const ingredientsString = ingredients.join(',');
      
      // Use a try-catch to handle potential errors with more specific error messages
      let data;
      try {
        data = await recipeService.suggestRecipes(ingredientsString);
      } catch (apiError: any) {
        if (apiError.response && apiError.response.status === 404) {
          throw new Error("L'API de recherche de recettes n'est pas disponible. Veuillez vérifier que le serveur backend est en cours d'exécution.");
        } else {
          throw apiError; // Re-throw other errors
        }
      }
      
      // Récupérer les favoris pour marquer les recettes
      const favoritesData = await recipeService.getFavorites();
      const favoriteIds = favoritesData.map((fav: any) => fav.id);
      setFavorites(favoriteIds);
      
      // Marquer les recettes qui sont dans les favoris
      const recipesWithFavorites = data.map((recipe: Recipe) => ({
        ...recipe,
        isFavorite: favoriteIds.includes(recipe.id)
      }));
      
      setRecipes(recipesWithFavorites);
    } catch (err: any) {
      console.error('Error fetching recipes:', err);
      setError(err.message || 'Une erreur est survenue lors de la recherche de recettes');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    // Rafraîchir les favoris après un changement
    try {
      const favoritesData = await recipeService.getFavorites();
      const favoriteIds = favoritesData.map((fav: any) => fav.id);
      setFavorites(favoriteIds);
      
      // Mettre à jour l'état des recettes
      setRecipes(recipes.map(recipe => ({
        ...recipe,
        isFavorite: favoriteIds.includes(recipe.id)
      })));
    } catch (err) {
      console.error('Error refreshing favorites:', err);
    }
  };

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            color: textColor,
            display: 'flex',
            alignItems: 'center',
            mb: 3
          }}
        >
          <SearchIcon sx={{ mr: 1, color: primaryColor }} />
          Recherche de recettes
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3, 
            color: alpha(textColor, 0.8),
            fontFamily: '"Poppins", sans-serif'
          }}
        >
          Entrez les ingrédients que vous avez à disposition pour découvrir des recettes délicieuses.
        </Typography>
      </Box>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          bgcolor: '#fff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            color: textColor,
            display: 'flex',
            alignItems: 'center',
            mb: 2
          }}
        >
          <RestaurantIcon sx={{ mr: 1, color: primaryColor }} />
          Quels ingrédients avez-vous ?
        </Typography>
        
        <Box sx={{ display: 'flex', mb: 3 }}>
          <Autocomplete
            freeSolo
            options={commonIngredients}
            value={ingredient}
            onChange={(_, newValue) => setIngredient(newValue || '')}
            onInputChange={(_, newInputValue) => setIngredient(newInputValue)}
            sx={{ 
              flexGrow: 1, 
              mr: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused fieldset': {
                  borderColor: primaryColor,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: primaryColor,
              }
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Ajouter un ingrédient" 
                variant="outlined" 
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <RestaurantIcon sx={{ color: alpha(textColor, 0.6) }} />
                    </InputAdornment>
                  )
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIngredient();
                  }
                }}
              />
            )}
          />
          <Button 
            variant="contained" 
            onClick={handleAddIngredient}
            disabled={!ingredient}
            startIcon={<AddIcon />}
            sx={{ 
              bgcolor: primaryColor,
              borderRadius: 2,
              textTransform: 'none',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 500,
              boxShadow: '0 4px 10px rgba(255, 107, 53, 0.3)',
              '&:hover': {
                bgcolor: alpha(primaryColor, 0.9),
                boxShadow: '0 6px 15px rgba(255, 107, 53, 0.4)',
              },
              '&.Mui-disabled': {
                bgcolor: alpha(primaryColor, 0.4),
                color: '#fff'
              }
            }}
          >
            Ajouter
          </Button>
        </Box>
        
        <Box 
          sx={{ 
            mb: 3, 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1,
            minHeight: '50px',
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(backgroundColor, 0.5),
            border: `1px dashed ${alpha(textColor, 0.2)}`
          }}
        >
          {ingredients.length > 0 ? (
            ingredients.map((ing, index) => (
              <Chip
                key={index}
                label={ing}
                onDelete={() => handleRemoveIngredient(ing)}
                sx={{
                  bgcolor: alpha(primaryColor, 0.1),
                  color: primaryColor,
                  borderRadius: '16px',
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 500,
                  '& .MuiChip-deleteIcon': {
                    color: primaryColor,
                    '&:hover': {
                      color: '#d32f2f'
                    }
                  }
                }}
              />
            ))
          ) : (
            <Typography 
              variant="body2" 
              sx={{ 
                color: alpha(textColor, 0.6),
                fontFamily: '"Poppins", sans-serif',
                fontStyle: 'italic',
                width: '100%',
                textAlign: 'center'
              }}
            >
              Aucun ingrédient ajouté. Commencez à ajouter vos ingrédients !
            </Typography>
          )}
        </Box>
        
        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleSearch}
          disabled={ingredients.length === 0 || loading}
          startIcon={<SearchIcon />}
          sx={{ 
            py: 1.5,
            bgcolor: primaryColor,
            borderRadius: 2,
            textTransform: 'none',
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 500,
            fontSize: '1rem',
            boxShadow: '0 4px 10px rgba(255, 107, 53, 0.3)',
            '&:hover': {
              bgcolor: alpha(primaryColor, 0.9),
              boxShadow: '0 6px 15px rgba(255, 107, 53, 0.4)',
            },
            '&.Mui-disabled': {
              bgcolor: alpha(primaryColor, 0.4),
              color: '#fff'
            }
          }}
        >
          Rechercher des recettes
        </Button>
      </Paper>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              color: '#D32F2F'
            }
          }}
        >
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            my: 8 
          }}
        >
          <CircularProgress sx={{ color: primaryColor, mb: 2 }} />
          <Typography 
            variant="body1" 
            sx={{ 
              color: alpha(textColor, 0.8),
              fontFamily: '"Poppins", sans-serif'
            }}
          >
            Recherche de recettes en cours...
          </Typography>
        </Box>
      ) : recipes.length > 0 ? (
        <>
          <Box sx={{ mt: 6, mb: 3 }}>
            <Divider sx={{ mb: 3 }} />
            <Typography 
              variant="h5" 
              sx={{ 
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 600,
                color: textColor,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <RestaurantIcon sx={{ mr: 1, color: primaryColor }} />
              Résultats ({recipes.length})
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 1, 
                color: alpha(textColor, 0.7),
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              Voici les recettes que vous pouvez préparer avec vos ingrédients.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {recipes.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
                <RecipeCard 
                  recipe={recipe} 
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {ingredients.length > 0 && !loading && (
            <>
              <RestaurantIcon sx={{ fontSize: 60, color: alpha(textColor, 0.3), mb: 2 }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: alpha(textColor, 0.7),
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 500,
                  mb: 1
                }}
              >
                Aucune recette trouvée
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: alpha(textColor, 0.6),
                  fontFamily: '"Poppins", sans-serif',
                  maxWidth: 500,
                  mx: 'auto'
                }}
              >
                Essayez d'ajouter d'autres ingrédients ou de modifier votre sélection.
                            </Typography>
            </>
          )}
        </Box>
      )}
    </Layout>
  );
};

export default SearchPage;
