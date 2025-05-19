import React, { ReactNode } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
// Importation directe des icônes Material-UI au lieu de @iconify
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { text: 'Accueil', icon: <HomeIcon />, path: '/' },
    { text: 'Recherche', icon: <RestaurantIcon />, path: '/search' },
    { text: 'Favoris', icon: <FavoriteIcon />, path: '/favorites' },
    { text: 'Profil', icon: <AccountCircleIcon />, path: '/profile' },
  ];

  // Couleurs thématiques pour la cuisine
  const appBarColor = '#A0522D'; // Orange chaleureux
  const drawerColor = '#FFF9EC'; // Beige clair
  const activeItemColor = '#FF6B35'; // Orange pour l'élément actif
  const footerColor = '#4A4238'; // Brun foncé pour le pied de page
  const backgroundColor = '#FFF9EC'; // Beige clair pour le fond

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: backgroundColor }}>
      <AppBar 
        position="static" 
        sx={{ 
          bgcolor: appBarColor,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ 
              mr: 2,
              '&:hover': {
                bgcolor: alpha('#fff', 0.2)
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <RestaurantMenuIcon sx={{ mr: 1 }} />
            Food Suggester
          </Typography>
          {isAuthenticated ? (
            <Button 
              color="inherit" 
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ 
                borderRadius: '20px',
                px: 2,
                '&:hover': {
                  bgcolor: alpha('#fff', 0.2)
                }
              }}
            >
              Déconnexion
            </Button>
          ) : (
            <Button 
              color="inherit" 
              onClick={() => navigate('/login')}
              startIcon={<LoginIcon />}
              sx={{ 
                borderRadius: '20px',
                px: 2,
                '&:hover': {
                  bgcolor: alpha('#fff', 0.2)
                }
              }}
            >
              Connexion
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer 
        anchor="left" 
        open={drawerOpen} 
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            bgcolor: drawerColor,
            width: 280
          }
        }}
      >
        <Box sx={{ py: 2, px: 1 }}>
          <Typography 
            variant="h6" 
            align="center" 
            sx={{ 
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
              color: '#4A4238',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RestaurantMenuIcon sx={{ mr: 1, color: activeItemColor }} />
            Food Suggester
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem 
                  button 
                  key={item.text} 
                  onClick={() => {
                    navigate(item.path);
                    toggleDrawer();
                  }}
                  sx={{
                    borderRadius: '8px',
                    mb: 1,
                    bgcolor: isActive ? alpha(activeItemColor, 0.1) : 'transparent',
                    color: isActive ? activeItemColor : 'inherit',
                    '&:hover': {
                      bgcolor: isActive ? alpha(activeItemColor, 0.15) : alpha('#000', 0.04)
                    }
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: isActive ? activeItemColor : '#666',
                      minWidth: '40px'
                    }}
                  >
                    {React.cloneElement(item.icon as React.ReactElement, { 
                      sx: { color: isActive ? activeItemColor : '#666' } 
                    })}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontWeight: isActive ? 600 : 400,
                      fontFamily: '"Poppins", sans-serif'
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
          <Divider sx={{ my: 2 }} />
          {isAuthenticated && (
            <List>
              <ListItem 
                button 
                onClick={handleLogout}
                sx={{
                  borderRadius: '8px',
                  color: '#D32F2F',
                  '&:hover': {
                    bgcolor: alpha('#D32F2F', 0.08)
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: '#D32F2F',
                    minWidth: '40px'
                  }}
                >
                  <LogoutIcon sx={{ color: '#D32F2F' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Déconnexion" 
                  primaryTypographyProps={{ 
                    fontFamily: '"Poppins", sans-serif'
                  }}
                />
              </ListItem>
            </List>
          )}
        </Box>
      </Drawer>

      <Container 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: 4,
          px: { xs: 2, sm: 4 },
          maxWidth: { sm: '100%', md: '1100px' }
        }}
      >
        {children}
      </Container>

      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          bgcolor: footerColor, 
          color: '#fff',
          mt: 'auto' 
        }}
      >
        <Container maxWidth="sm">
          <Typography 
            variant="body2" 
            align="center"
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              fontFamily: '"Poppins", sans-serif'
            }}
          >
            <RestaurantMenuIcon fontSize="small" />
            © {new Date().getFullYear()} Food Suggester
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
