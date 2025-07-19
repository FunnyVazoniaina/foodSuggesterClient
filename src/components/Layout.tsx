import React, { ReactNode, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Icon } from '@iconify/react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const menuItems = [
    { text: 'Accueil', icon: 'mdi:home', path: '/' },
    { text: 'Recherche', icon: 'mdi:silverware-fork-knife', path: '/search' },
    { text: 'Historique', icon: 'mdi:history', path: '/history' },
    { text: 'Favoris', icon: 'mdi:heart', path: '/favorites' },
    { text: 'Profil', icon: 'mdi:account-circle', path: '/profile' },
  ];

  const navigateAndClose = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-orange-50 font-['Poppins']">
      {/* AppBar */}
      <header className="fixed top-0 left-0 right-0 bg-amber-800 shadow-lg z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={toggleDrawer}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors mr-3"
            >
              <Icon icon="mdi:menu" className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-white">Food Suggester</h1>
          </div>
          
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-full transition-colors"
            >
              <Icon icon="mdi:logout" className="w-5 h-5" />
              Déconnexion
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-full transition-colors"
            >
              <Icon icon="mdi:login" className="w-5 h-5" />
              Connexion
            </button>
          )}
        </div>
      </header>

      {/* Drawer */}
      {drawerOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleDrawer}
          />
          <aside className="fixed left-0 top-0 h-full w-72 bg-orange-50 shadow-xl z-50 transform transition-transform">
            <div className="p-4">
              {/* Drawer Header */}
              <div className="flex items-center justify-center mb-6 pt-4">
                <Icon icon="mdi:silverware" className="w-6 h-6 text-orange-600 mr-2" />
                <h2 className="text-lg font-semibold text-amber-900">Food Suggester</h2>
              </div>
              
              <hr className="border-gray-300 mb-4" />
              
              {/* Menu Items */}
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <button
                      key={item.text}
                      onClick={() => navigateAndClose(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-orange-600/10 text-orange-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon 
                        icon={item.icon} 
                        className={`w-5 h-5 ${isActive ? 'text-orange-600' : 'text-gray-600'}`} 
                      />
                      {item.text}
                    </button>
                  );
                })}
              </nav>
              
              {/* Logout in Drawer */}
              {isAuthenticated && (
                <>
                  <hr className="border-gray-300 my-4" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Icon icon="mdi:logout" className="w-5 h-5" />
                    Déconnexion
                  </button>
                </>
              )}
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 pt-20 px-4 sm:px-8 py-8 max-w-6xl mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-amber-900 text-white py-6 mt-auto">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Icon icon="mdi:silverware" className="w-4 h-4" />
            © {new Date().getFullYear()} Food Suggester - FunnyVazoniaina
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
