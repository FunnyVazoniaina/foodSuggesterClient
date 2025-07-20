import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
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

  const handleSearchWithIngredients = (ingredients: string) => {
    navigate(`/search?ingredients=${encodeURIComponent(ingredients)}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy à HH:mm', { locale: fr });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-6">
        <h1 className="text-3xl font-semibold text-amber-900 mb-6 font-['Poppins']">
          Historique des recherches
        </h1>
        
        <div className="flex justify-end mb-4">
          <button 
            onClick={handleClearHistory}
            disabled={history.length === 0 || loading}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-['Poppins']"
          >
            <Icon icon="mdi:delete-sweep" className="w-5 h-5 mr-2" />
            Tout effacer
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center">
              <Icon icon="mdi:alert-circle" className="w-5 h-5 mr-2" />
              {error}
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Icon icon="mdi:loading" className="w-8 h-8 text-orange-600 animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-gray-500 font-['Poppins']">
              Aucun historique de recherche disponible
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {history.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSearchWithIngredients(item.ingredients)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 font-['Poppins']">
                        {item.ingredients}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 font-['Poppins']">
                        {formatDate(item.searched_at)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSearchWithIngredients(item.ingredients);
                        }}
                        className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                        title="Rechercher avec ces ingrédients"
                      >
                        <Icon icon="mdi:magnify" className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <Icon icon="mdi:delete" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HistoryPage;
