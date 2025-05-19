import React, { useState, useContext, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Link, 
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Couleurs thématiques
  const primaryColor = '#FF6B35'; // Orange chaleureux
  const backgroundColor = '#FFF9EC'; // Beige clair
  const textColor = '#4A4238'; // Brun foncé

  useEffect(() => {
    // Vérifier si un message de succès est passé via location state
    if (location.state && location.state.message) {
      setSuccess(location.state.message);
      // Nettoyer l'état de navigation pour éviter d'afficher le message après un rafraîchissement
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: backgroundColor,
        p: 2
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, sm: 4 }, 
          maxWidth: 450, 
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Icon 
            icon="mdi:silverware-fork-knife" 
            width="64" 
            height="64" 
            style={{ color: primaryColor }} 
          />
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
              color: textColor,
              mt: 1
            }}
          >
            Food Suggester
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'text.secondary',
              fontFamily: '"Poppins", sans-serif'
            }}
          >
            Connectez-vous à votre compte
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                color: '#D32F2F'
              }
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              borderRadius: 2
            }}
          >
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adresse email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon="mdi:email" width="20" height="20" style={{ color: alpha(textColor, 0.7) }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused fieldset': {
                  borderColor: primaryColor,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: primaryColor,
              },
              mb: 2
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon="mdi:lock" width="20" height="20" style={{ color: alpha(textColor, 0.7) }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    <Icon 
                      icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} 
                      width="20" 
                      height="20" 
                      style={{ color: alpha(textColor, 0.7) }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused fieldset': {
                  borderColor: primaryColor,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: primaryColor,
              },
              mb: 2
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ 
              mt: 2, 
              mb: 3,
              py: 1.2,
              bgcolor: primaryColor,
              borderRadius: 2,
              textTransform: 'none',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 500,
              fontSize: '1rem',
              boxShadow: '0 4px 10px rgba(255, 107, 53, 0.3)',
              '&:hover': {
                bgcolor: alpha(primaryColor, 0.9),
                boxShadow: '0 6px 15px rgba(255, 107, 53, 0.4)',
              }
            }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="body2"
              sx={{ 
                fontFamily: '"Poppins", sans-serif',
                color: alpha(textColor, 0.8)
              }}
            >
              Pas encore de compte ?{' '}
              <Link 
                component={RouterLink} 
                to="/register" 
                sx={{ 
                  color: primaryColor,
                  fontWeight: 500,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Inscrivez-vous
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
