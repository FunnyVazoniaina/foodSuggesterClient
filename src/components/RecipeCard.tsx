import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, IconButton, Tooltip, Box } from '@mui/material';
import { Icon } from '@iconify/react';
import { recipeService } from '../services/api';

interface RecipeCardProps {
  recipe: {
    id: number;
    title: string;
    image: string;
    usedIngredientCount: number;
    missedIngredientCount: number;
    likes?: number;
    isFavorite?: boolean;
  };
  onFavoriteToggle?: () => void;
  showFavoriteButton?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onFavoriteToggle,
  showFavoriteButton = true
}) => {
  const handleFavoriteClick = async () => {
    try {
      if (recipe.isFavorite) {
        await recipeService.removeFavorite(recipe.id);
      } else {
        await recipeService.addFavorite(recipe.id, recipe.title, recipe.image);
      }
      if (onFavoriteToggle) {
        onFavoriteToggle();
      }
    } catch (error) {
      console.error('Error toggling favorite', error);
    }
  };

  return (
    <Card sx={{ 
      maxWidth: 345, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 6
      }
    }}>
      <CardMedia
        component="img"
        height="180"
        image={recipe.image}
        alt={recipe.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap title={recipe.title}>
          {recipe.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Icon icon="mdi:check-circle" color="#4caf50" width="20" height="20" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {recipe.usedIngredientCount} ingrédients utilisés
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Icon icon="mdi:alert-circle" color="#ff9800" width="20" height="20" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {recipe.missedIngredientCount} ingrédients manquants
          </Typography>
        </Box>
      </CardContent>
      <CardActions disableSpacing>
        {showFavoriteButton && (
          <Tooltip title={recipe.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}>
            <IconButton aria-label="add to favorites" onClick={handleFavoriteClick}>
              <Icon 
                icon={recipe.isFavorite ? "mdi:heart" : "mdi:heart-outline"} 
                color={recipe.isFavorite ? "#f44336" : "inherit"} 
                width="24" 
                height="24" 
              />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Voir la recette">
          <IconButton aria-label="view recipe">
            <Icon icon="mdi:book-open-variant" width="24" height="24" />
          </IconButton>
        </Tooltip>
        {recipe.likes !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            <Icon icon="mdi:thumb-up" width="20" height="20" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              {recipe.likes}
            </Typography>
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default RecipeCard;
