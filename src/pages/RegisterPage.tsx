import React, { useState, useContext } from 'react';
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
  Stepper,
  Step,
  StepLabel,
  alpha,
  useTheme
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { AuthContext } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  // Couleurs thématiques
  const primaryColor = '#FF6B35'; // Orange chaleureux
  const backgroundColor = '#FFF9EC'; // Beige clair
  const textColor = '#4A4238'; // Brun foncé
  const stepperActiveColor = primaryColor;
  const stepperCompletedColor = '#4CAF50';

  const steps = ['Informations personnelles', 'Sécurité'];

  const validateStep1 = () => {
    if (!name || !email) {
      setError('Veuillez remplir tous les champs');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer une adresse email valide');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (!password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return false;
    }
    
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    setError('');
    
    if (activeStep === 0 && validateStep1()) {
      setActiveStep(1);
    } else if (activeStep === 1 && validateStep2()) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    setError('');
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await register(name, email, password);
      navigate('/login', { state: { message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' } });
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
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
          maxWidth: 550, 
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
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
            Créez votre compte
          </Typography>
        </Box>

        <Stepper 
          activeStep={activeStep} 
          sx={{ 
            mb: 4,
            '& .MuiStepIcon-root.Mui-active': {
              color: stepperActiveColor,
            },
            '& .MuiStepIcon-root.Mui-completed': {
              color: stepperCompletedColor,
            },
            '& .MuiStepLabel-label': {
              fontFamily: '"Poppins", sans-serif',
              fontSize: '0.9rem'
            }
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

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

        <Box>
          {activeStep === 0 ? (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Nom complet"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon icon="mdi:account" width="20" height="20" style={{ color: alpha(textColor, 0.7) }} />
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
                id="email"
                label="Adresse email"
                name="email"
                autoComplete="email"
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
            </>
          ) : (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirmer le mot de passe"
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon icon="mdi:lock-check" width="20" height="20" style={{ color: alpha(textColor, 0.7) }} />
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
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  mt: 1, 
                  mb: 2,
                  color: alpha(textColor, 0.7),
                  fontFamily: '"Poppins", sans-serif'
                }}
              >
                <Icon 
                  icon="mdi:information-outline" 
                  width="16" 
                  height="16" 
                  style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} 
                />
                Le mot de passe doit contenir au moins 8 caractères.
              </Typography>
            </>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                borderColor: alpha(textColor, 0.5),
                color: textColor,
                textTransform: 'none',
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 500,
                '&:hover': {
                  borderColor: textColor,
                  bgcolor: alpha(textColor, 0.04)
                }
              }}
            >
              Retour
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              sx={{ 
                py: 1.2,
                px: 3,
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
              {activeStep === steps.length - 1 ? (loading ? 'Inscription en cours...' : 'S\'inscrire') : 'Suivant'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography 
              variant="body2"
              sx={{ 
                fontFamily: '"Poppins", sans-serif',
                color: alpha(textColor, 0.8)
              }}
            >
              Déjà un compte ?{' '}
              <Link 
                component={RouterLink} 
                to="/login" 
                sx={{ 
                  color: primaryColor,
                  fontWeight: 500,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Connectez-vous
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
