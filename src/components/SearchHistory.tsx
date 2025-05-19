import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Button, 
  Divider, 
  Paper, 
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Icon } from '@iconify/react';
import { historyService } from '../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HistoryItem {
  id: number;
  ingredients: string;
  searched_at: string;
}

interface SearchHistoryProps {
  onSelectHistory?: (ingredients: string) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ onSelectHistory }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await historyService.getSearchHistory();
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Impossible de récupérer l\'historique des recherches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDeleteItem = async (id: number) => {
    try {
      await historyService.deleteHistoryItem(id);
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting history item:', err);
      setError('Impossible de supprimer cet élément');
    }
  };

  const handleClearHistory = async () => {
    try {
      await historyService.clearHistory();
      setHistory([]);
    } catch (err) {
      console.error('Error clearing history:', err);
      setError('Impossible de supprimer l\'historique');
    }
  };

  const handleSelectHistory = (ingredients: string) => {
    if (onSelectHistory) {
      onSelectHistory(ingredients);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy à HH:mm', { locale: fr });
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Historique des recherches
        </Typography>
        <Button 
          variant="outlined" 
          color="error" 
          startIcon={<Icon icon="mdi:delete-sweep" />}
          onClick={handleClearHistory}
          disabled={history.length === 0 || loading}
        >
          Tout effacer
        </Button>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : history.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', p: 2 }}>
          Aucun historique de recherche disponible
        </Typography>
      ) : (
        <List>
          {history.map((item) => (
            <ListItem 
              key={item.id} 
              divider 
              button 
              onClick={() => handleSelectHistory(item.ingredients)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <ListItemText 
                primary={item.ingredients} 
                secondary={formatDate(item.searched_at)}
              />
              <ListItemSecondaryAction>
                <Tooltip title="Supprimer">
                  <IconButton 
                    edge="end" 
                    aria-label="delete" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
                    }}
                  >
                    <Icon icon="mdi:delete" />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default SearchHistory;
