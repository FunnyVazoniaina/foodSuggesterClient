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
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-amber-50/20 to-yellow-50/30">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Icon icon="mdi:history" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-700 via-amber-700 to-orange-800 bg-clip-text text-transparent font-['Poppins']">
                  Historique des recherches
                </h1>
                <p className="text-gray-600 font-['Poppins'] text-lg mt-1">
                  Retrouvez vos recherches précédentes
                </p>
              </div>
            </div>
          </div>
          
          {/* Actions Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500 font-['Poppins']">
              {history.length > 0 && (
                <span className="inline-flex items-center">
                  <Icon icon="mdi:database" className="w-4 h-4 mr-1" />
                  {history.length} recherche{history.length > 1 ? 's' : ''} enregistrée{history.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button 
              onClick={handleClearHistory}
              disabled={history.length === 0 || loading}
              className="group inline-flex items-center px-6 py-3 bg-white border-2 border-red-200 text-red-600 rounded-2xl hover:bg-red-50 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-['Poppins'] font-medium shadow-sm hover:shadow-md"
            >
              <Icon icon="mdi:delete-sweep" className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Tout effacer
            </button>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-6 rounded-r-xl shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Icon icon="mdi:alert-circle" className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-red-800 font-semibold font-['Poppins']">Erreur</h3>
                  <p className="text-red-700 font-['Poppins']">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Content Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-16">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Icon icon="mdi:loading" className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full opacity-20 animate-pulse"></div>
                </div>
                <p className="text-gray-600 font-['Poppins'] text-lg">Chargement de l'historique...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon icon="mdi:history" className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2 font-['Poppins']">
                  Aucun historique disponible
                </h3>
                <p className="text-gray-500 font-['Poppins']">
                  Vos recherches d'ingrédients apparaîtront ici
                </p>
              </div>
            ) : (
              <div className="p-2">
                {history.map((item, index) => (
                  <div 
                    key={item.id}
                    className="group m-2 p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-orange-200 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => handleSearchWithIngredients(item.ingredients)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center mr-4 group-hover:from-orange-200 group-hover:to-amber-200 transition-all duration-300">
                          <Icon icon="mdi:food" className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 font-['Poppins'] text-lg mb-1 group-hover:text-orange-700 transition-colors">
                            {item.ingredients}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <Icon icon="mdi:clock-outline" className="w-4 h-4 mr-1" />
                            <span className="font-['Poppins']">
                              {formatDate(item.searched_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSearchWithIngredients(item.ingredients);
                          }}
                          className="p-3 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200"
                          title="Rechercher avec ces ingrédients"
                        >
                          <Icon icon="mdi:magnify" className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.id);
                          }}
                          className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                          title="Supprimer"
                        >
                          <Icon icon="mdi:delete-outline" className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer hint */}
          {history.length > 0 && (
            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm font-['Poppins'] flex items-center justify-center">
                <Icon icon="mdi:information-outline" className="w-4 h-4 mr-1" />
                Cliquez sur une recherche pour la relancer
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HistoryPage;