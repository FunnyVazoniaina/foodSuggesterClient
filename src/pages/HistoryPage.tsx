import { useState, useEffect } from 'react';
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
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
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
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting history item:', err);
      setError('Impossible de supprimer cet élément');
    }
  };

  const handleClearHistory = async () => {
    try {
      await historyService.clearHistory();
      setHistory([]);
      setConfirmClearAll(false);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mr-4">
                <Icon icon="mdi:history" className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <h1 className="text-4xl font-light text-slate-800 font-poppins tracking-tight">
                  Historique des recherches
                </h1>
                <p className="text-slate-600 font-poppins text-lg mt-1">
                  Retrouvez vos recherches précédentes
                </p>
              </div>
            </div>
          </div>
          
          {/* Actions Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-slate-500">
              {history.length > 0 && (
                <span className="inline-flex items-center">
                  <Icon icon="mdi:database" className="w-4 h-4 mr-1" />
                  {history.length} recherche{history.length > 1 ? 's' : ''} enregistrée{history.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button 
              onClick={() => setConfirmClearAll(true)}
              disabled={history.length === 0 || loading}
              className="group inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
            >
              <Icon icon="mdi:delete-sweep" className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Tout effacer
            </button>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-6 mb-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Icon icon="mdi:alert-circle" className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-red-800 font-medium">Erreur</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Content Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-16">
                <div className="relative">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Icon icon="mdi:loading" className="w-8 h-8 text-slate-600 animate-spin" />
                  </div>
                </div>
                <p className="text-slate-600 text-lg">Chargement de l'historique...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon icon="mdi:history" className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-medium text-slate-700 mb-2">
                  Aucun historique disponible
                </h3>
                <p className="text-slate-500">
                  Vos recherches d'ingrédients apparaîtront ici
                </p>
              </div>
            ) : (
              <div className="p-2">
                {history.map((item, index) => (
                  <div 
                    key={item.id}
                    className="group m-2 p-6 bg-white rounded-xl hover:bg-slate-50 border border-gray-100 hover:border-slate-200 cursor-pointer transition-all duration-200"
                    onClick={() => handleSearchWithIngredients(item.ingredients)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex items-center">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-slate-200 transition-all duration-200">
                          <Icon icon="mdi:food" className="w-6 h-6 text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-800 text-lg mb-1 group-hover:text-slate-900 transition-colors">
                            {item.ingredients}
                          </h3>
                          <div className="flex items-center text-sm text-slate-500">
                            <Icon icon="mdi:clock-outline" className="w-4 h-4 mr-1" />
                            <span>
                              {formatDate(item.searched_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSearchWithIngredients(item.ingredients);
                          }}
                          className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
                          title="Rechercher avec ces ingrédients"
                        >
                          <Icon icon="mdi:magnify" className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(item.id);
                          }}
                          className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
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
              <p className="text-slate-400 text-sm flex items-center justify-center">
                <Icon icon="mdi:information-outline" className="w-4 h-4 mr-1" />
                Cliquez sur une recherche pour la relancer
              </p>
            </div>
          )}
        </div>

        {/* Modal de confirmation pour supprimer un élément */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Icon icon="mdi:delete-outline" className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-medium text-slate-800">Confirmer la suppression</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Êtes-vous sûr de vouloir supprimer cette recherche de votre historique ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeleteItem(confirmDelete)}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmation pour tout effacer */}
        {confirmClearAll && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Icon icon="mdi:delete-sweep" className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-medium text-slate-800">Effacer tout l'historique</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Êtes-vous sûr de vouloir supprimer tout votre historique de recherche ? Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmClearAll(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleClearHistory}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                >
                  Tout effacer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HistoryPage;