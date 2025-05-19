import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  CircularProgress, 
  Alert, 
  Button, 
  Paper,
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Layout from '../components/Layout';
import RecipeCard from '../components/RecipeCard';
import { recipeService } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Recipe {
  id: number;
  title: string;
  image: string;
  isFavorite: boolean;
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  // Couleurs thématiques
  const primaryColor = '#FF6B35'; // Orange chaleureux
  const backgroundColor = '#FFF9EC'; // Beige clair
  const textColor = '#4A4238'; // Brun foncé
  const heartColor = '#E63946'; // Rouge pour les cœurs

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await recipeService.getFavorites();
      // Transformer les données pour correspondre à la structure attendue par RecipeCard
      const formattedFavorites = data.map((fav: any) => ({
        id: fav.id,
        title: fav.title,
        image: fav.image_url,
        usedIngredientCount: 0,
        missedIngredientCount: 0,
        isFavorite: true
      }));
      setFavorites(formattedFavorites);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Une erreur est survenue lors de la récupération de vos favoris');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteToggle = () => {
    fetchFavorites();
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
          <FavoriteIcon sx={{ mr: 1, color: heartColor }} />
          Mes recettes favorites
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3, 
            color: alpha(textColor, 0.8),
            fontFamily: '"Poppins", sans-serif'
          }}
        >
          Retrouvez ici toutes les recettes que vous avez ajoutées à vos favoris.
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
      </Box>

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
            Chargement de vos favoris...
          </Typography>
        </Box>
      ) : favorites.length > 0 ? (
        <Grid container spacing={3}>
          {favorites.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
              <RecipeCard 
                recipe={recipe} 
                onFavoriteToggle={handleFavoriteToggle}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper 
          elevation={0} 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            px: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: alpha(backgroundColor, 0.5),
            borderRadius: 3,
            border: `1px dashed ${alpha(textColor, 0.2)}`
          }}
        >
          <FavoriteIcon sx={{ fontSize: 60, color: alpha(heartColor, 0.3), mb: 2 }} />
          <Typography 
            variant="h6" 
            sx={{ 
              color: textColor,
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 500,
              mb: 1
            }}
          >
            Vous n'avez pas encore de recettes favorites
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: alpha(textColor, 0.7),
              fontFamily: '"Poppins", sans-serif',
              mb: 3,
              maxWidth: 500,
              mx: 'auto'
            }}
          >
            Explorez des recettes et ajoutez-les à vos favoris pour les retrouver facilement ici.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/search')}
            startIcon={<SearchIcon />}
            sx={{ 
              bgcolor: primaryColor,
              borderRadius: 2,
              textTransform: 'none',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 500,
              px: 3,
              py: 1.2,
              boxShadow: '0 4px 10px rgba(255, 107, 53, 0.3)',
              '&:hover': {
                bgcolor: alpha(primaryColor, 0.9),
                boxShadow: '0 6px 15px rgba(255, 107, 53, 0.4)',
              }
            }}
          >
            Rechercher des recettes
          </Button>
        </Paper>
      )}
    </Layout>
  );
};

export default FavoritesPage;
