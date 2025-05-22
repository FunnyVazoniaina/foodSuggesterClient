import React, { useState } from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  CardActions, 
  IconButton, 
  Tooltip, 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { Icon } from '@iconify/react';
import { recipeService } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface RecipeCardProps {
  recipe: {
    id: number;
    title: string;
    image: string;
    usedIngredientCount: number;
    missedIngredientCount: number;
    likes?: number;
    isFavorite?: boolean;
    sourceUrl?: string;
    // Nouvelles propriétés
    instructions?: string;
    readyInMinutes?: number;
    preparationMinutes?: number;
    cookingMinutes?: number;
    steps?: Array<{
      number: number;
      step: string;
    }>;
  };
  onFavoriteToggle?: () => void;
  showFavoriteButton?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onFavoriteToggle,
  showFavoriteButton = true
}) => {
  const navigate = useNavigate();
  // État pour contrôler l'ouverture/fermeture de la boîte de dialogue
  const [openDialog, setOpenDialog] = useState(false);

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

  // Ouvrir la boîte de dialogue au lieu de naviguer
  const handleViewRecipe = () => {
    setOpenDialog(true);
  };

  // Fermer la boîte de dialogue
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Ouvrir l'URL source dans un nouvel onglet
  const handleOpenSourceUrl = () => {
    if (recipe.sourceUrl) {
      window.open(recipe.sourceUrl, '_blank');
    }
  };

  return (
    <>
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
          {recipe.readyInMinutes && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Icon icon="mdi:clock-outline" color="#2196f3" width="20" height="20" />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Prêt en {recipe.readyInMinutes} minutes
              </Typography>
            </Box>
          )}
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
            <IconButton aria-label="view recipe" onClick={handleViewRecipe}>
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

      {/* Boîte de dialogue pour afficher les détails de la recette */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="recipe-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="recipe-dialog-title">
          {recipe.title}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mb: 2 }}>
            <Box sx={{ flex: '0 0 40%', mr: { md: 2 }, mb: { xs: 2, md: 0 } }}>
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                style={{ width: '100%', borderRadius: '8px' }} 
              />
            </Box>
            <Box sx={{ flex: '1 1 auto' }}>
              <Typography variant="h6" gutterBottom>
                Temps de préparation
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                {recipe.readyInMinutes && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Icon icon="mdi:clock-outline" color="#2196f3" width="24" height="24" />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      Temps total: {recipe.readyInMinutes} minutes
                    </Typography>
                  </Box>
                )}
                {recipe.preparationMinutes && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Icon icon="mdi:knife" color="#9c27b0" width="24" height="24" />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      Préparation: {recipe.preparationMinutes} minutes
                    </Typography>
                  </Box>
                )}
                {recipe.cookingMinutes && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Icon icon="mdi:pot-steam" color="#ff5722" width="24" height="24" />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      Cuisson: {recipe.cookingMinutes} minutes
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Typography variant="h6" gutterBottom>
                Ingrédients
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  {recipe.usedIngredientCount} ingrédients utilisés, {recipe.missedIngredientCount} ingrédients manquants
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Instructions
          </Typography>
          
          {recipe.instructions ? (
            <Typography variant="body1" paragraph>
              {recipe.instructions}
            </Typography>
          ) : recipe.steps && recipe.steps.length > 0 ? (
            <List>
              {recipe.steps.map((step) => (
                <ListItem key={step.number}>
                  <ListItemText
                    primary={`Étape ${step.number}`}
                    secondary={step.step}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Aucune instruction disponible. Consultez la source originale pour plus de détails.
            </Typography>
          )}
          
          {recipe.sourceUrl && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Pour des instructions plus détaillées, consultez la source originale.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {recipe.sourceUrl && (
            <Button onClick={handleOpenSourceUrl} color="primary">
              Voir la source originale
            </Button>
          )}
          <Button onClick={handleCloseDialog} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RecipeCard;
