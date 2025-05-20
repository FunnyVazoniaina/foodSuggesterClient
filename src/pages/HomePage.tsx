import React from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Paper, 
  Container, 
  alpha, 
  useTheme,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import Layout from '../components/Layout';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Palette de couleurs améliorée - jaune foncé remplacé
  const primaryColor = '#FF6B35'; // Orange chaleureux (conservé)
  const secondaryColor = '#A0522D'; // Marron (pour la barre de navigation)
 const accentColor = '#FFF0E5'; // Pêche très clair
const lightAccent = '#FFF5EB'; // Crème/beige très clair
  const textColor = '#4A4238'; // Brun foncé pour le texte
  const cardBgColor = '#FFFCF7'; // Beige très clair pour les cartes
  const buttonHoverColor = '#E85826'; // Orange plus foncé pour les survols

  const features = [
    {
      icon: <RestaurantIcon sx={{ fontSize: 48, color: primaryColor }} />,
      title: 'Suggestions de recettes',
      description: 'Obtenez des suggestions de recettes basées sur les ingrédients que vous avez déjà.'
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 48, color: primaryColor }} />,
      title: 'Favoris',
      description: 'Enregistrez vos recettes préférées pour y accéder facilement plus tard.'
    },
    {
      icon: <HistoryIcon sx={{ fontSize: 48, color: primaryColor }} />,
      title: 'Historique de recherche',
      description: 'Consultez vos recherches précédentes pour retrouver facilement vos recettes.'
    },
    {
      icon: <PersonIcon sx={{ fontSize: 48, color: primaryColor }} />,
      title: 'Profil personnalisé',
      description: 'Personnalisez votre expérience avec un profil utilisateur dédié.'
    }
  ];

  const steps = [
    {
      icon: <FormatListBulletedIcon sx={{ fontSize: 64, color: primaryColor }} />,
      title: '1. Listez vos ingrédients',
      description: 'Entrez les ingrédients que vous avez dans votre cuisine.'
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 64, color: primaryColor }} />,
      title: '2. Découvrez des recettes',
      description: 'Obtenez des suggestions de recettes adaptées à vos ingrédients.'
    },
    {
      icon: <RestaurantMenuIcon sx={{ fontSize: 64, color: primaryColor }} />,
      title: '3. Cuisinez et savourez',
      description: 'Suivez la recette et profitez de votre délicieux repas !'
    }
  ];

  return (
    <Layout>
      {/* Hero Section avec fond vert menthe clair */}
      <Box sx={{ 
        textAlign: 'center', 
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 4 },
        background: `linear-gradient(135deg, ${accentColor} 0%, ${alpha(accentColor, 0.8)} 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: textColor,
        borderRadius: 4,
        mb: 6,
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Motif décoratif */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'url(/pattern-food.png)', // Vous pouvez ajouter un motif subtil si disponible
          backgroundSize: '200px',
          zIndex: 0
        }} />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 700,
              color: secondaryColor,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Food Suggester
          </Typography>
          
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 500,
              color: textColor,
              mb: 4,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.5
            }}
          >
            Trouvez des recettes délicieuses avec les ingrédients que vous avez déjà dans votre cuisine
          </Typography>
          
          <Button 
            variant="outlined" // Changé de "contained" à "outlined"
            size="large" 
            onClick={() => navigate('/search')}
            startIcon={<SearchIcon sx={{ color: primaryColor }} />} // Couleur de l'icône
            sx={{ 
              mt: 2,
              py: 1.5,
              px: 4,
              bgcolor: 'transparent', // Fond transparent
              color: primaryColor, // Texte en orange
              borderColor: primaryColor, // Bordure orange
              borderWidth: 2, // Bordure plus épaisse
              borderRadius: 2,
              textTransform: 'none',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
              fontSize: '1.1rem',
              boxShadow: 'none', // Pas d'ombre
              '&:hover': {
                bgcolor: alpha(primaryColor, 0.05), // Légère teinte orange au survol
                borderColor: buttonHoverColor, // Bordure plus foncée au survol
                color: buttonHoverColor, // Texte plus foncé au survol
              }
            }}
          >
            Commencer à chercher
          </Button>

        </Container>
      </Box>

      {/* Section des fonctionnalités */}
      <Box sx={{ mb: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          align="center"
          sx={{ 
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            color: textColor,
            mb: 5
          }}
        >
          Nos fonctionnalités
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 3,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  bgcolor: cardBgColor,
                  border: `1px solid ${alpha(primaryColor, 0.1)}`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 20px ${alpha(primaryColor, 0.15)}`
                  }
                }}
              >
                <CardContent sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textAlign: 'center',
                  flexGrow: 1
                }}>
                  <Box sx={{ 
                    mb: 2, 
                    p: 1.5, 
                    borderRadius: '50%', 
                    bgcolor: alpha(accentColor, 0.6),
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    {feature.icon}
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    sx={{ 
                      mb: 2,
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 600,
                      color: textColor
                    }}
                  >
                    {feature.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: alpha(textColor, 0.8),
                      fontFamily: '"Poppins", sans-serif',
                      lineHeight: 1.6
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Section "Comment ça marche" */}
      <Box 
        sx={{ 
          py: 6, 
          px: 3,
          bgcolor: lightAccent,
          borderRadius: 4,
          mb: 6
        }}
      >
        <Typography 
          variant="h4" 
          component="h2" 
          align="center"
          sx={{ 
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            color: textColor,
            mb: 5
          }}
        >
          Comment ça marche ?
        </Typography>
        
        <Grid container spacing={4} justifyContent="center">
          {steps.map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box 
                sx={{ 
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative'
                }}
              >
                {/* Ligne de connexion entre les étapes */}
                {index < steps.length - 1 && (
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: '30%',
                      right: '-10%',
                      width: '20%',
                      height: '2px',
                      bgcolor: alpha(primaryColor, 0.3),
                      display: { xs: 'none', md: 'block' }
                    }}
                  />
                )}
                
                <Box sx={{ mb: 3 }}>
                  {step.icon}
                </Box>
                
                <Typography 
                  variant="h6" 
                  component="h3" 
                  sx={{ 
                    mb: 2,
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 600,
                    color: textColor
                  }}
                >
                  {step.title}
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: alpha(textColor, 0.8),
                    fontFamily: '"Poppins", sans-serif',
                    maxWidth: '300px',
                    mx: 'auto'
                  }}
                >
                  {step.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

    </Layout>
  );
};

export default HomePage;
