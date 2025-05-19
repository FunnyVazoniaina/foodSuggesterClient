import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Button, 
  Divider, 
  CircularProgress, 
  Alert,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { historyService } from '../services/api';

interface HistoryItem {
  id: number;
  ingredients: string;
  searched_at: string;
}

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Utiliser le service API
      const data = await historyService.getSearchHistory();
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Impossible de récupérer l\'historique des recherches');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await historyService.deleteHistoryItem(id);
      // Mettre à jour l'état local après suppression
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting history item:', err);
      setError('Impossible de supprimer cet élément');
    }
  };

  const handleClearHistory = async () => {
    try {
      await historyService.clearHistory();
      // Vider l'historique local
      setHistory([]);
    } catch (err) {
      console.error('Error clearing history:', err);
      setError('Impossible de supprimer l\'historique');
    }
  };

  const handleSearchWithIngredients = (ingredients: string) => {
    // Rediriger vers la page de recherche avec les ingrédients
    navigate(`/search?ingredients=${encodeURIComponent(ingredients)}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy à HH:mm', { locale: fr });
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Historique des recherches
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteSweepIcon />}
            onClick={handleClearHistory}
            disabled={history.length === 0 || loading}
          >
            Tout effacer
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Paper elevation={3} sx={{ p: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : history.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', p: 3 }}>
              Aucun historique de recherche disponible
            </Typography>
          ) : (
            <List>
              {history.map((item) => (
                <ListItem 
                  key={item.id} 
                  divider 
                  sx={{ 
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSearchWithIngredients(item.ingredients)}
                >
                  <ListItemText 
                    primary={
                      <Typography variant="subtitle1" fontWeight="medium">
                        {item.ingredients}
                      </Typography>
                    } 
                    secondary={formatDate(item.searched_at)}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Rechercher avec ces ingrédients">
                      <IconButton 
                        edge="end" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSearchWithIngredients(item.ingredients);
                        }}
                        sx={{ mr: 1 }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton 
                        edge="end" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};

export default HistoryPage;
