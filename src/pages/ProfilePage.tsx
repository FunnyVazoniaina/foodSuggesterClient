import React, { useState, useEffect, useContext } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Avatar, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  CircularProgress,
  Alert,
  Grid,
  alpha,
  useTheme,
  InputAdornment,
  IconButton
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import Layout from '../components/Layout';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const ProfilePage: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  // Couleurs thématiques
  const primaryColor = '#FF6B35'; // Orange chaleureux
  const backgroundColor = '#FFF9EC'; // Beige clair
  const textColor = '#4A4238'; // Brun foncé
  const accentColor = '#2E86AB'; // Bleu pour les accents

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Récupérer les informations de l'utilisateur
        const userResponse = await api.get('/user/profile');
        setUser(userResponse.data);
        setName(userResponse.data.name);
        setEmail(userResponse.data.email);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Une erreur est survenue lors de la récupération de vos données');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
    setPassword('');
    setConfirmPassword('');
    setUpdateError('');
    setUpdateSuccess('');
    // Réinitialiser les champs avec les valeurs actuelles
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdateError('');
      
      // Validation
      if (password && password !== confirmPassword) {
        setUpdateError('Les mots de passe ne correspondent pas');
        return;
      }

      // Préparer les données à mettre à jour
      const updateData: { name?: string; email?: string; password?: string } = {};
      if (name !== user?.name) updateData.name = name;
      if (email !== user?.email) updateData.email = email;
      if (password) updateData.password = password;

      // Si aucune donnée à mettre à jour
      if (Object.keys(updateData).length === 0) {
        setUpdateError('Aucune modification à enregistrer');
        return;
      }

      // Mettre à jour le profil
      await api.put('/user/profile', updateData);
      
      // Mettre à jour les données locales
      if (updateData.name || updateData.email) {
        setUser(prev => prev ? { 
          ...prev, 
          name: updateData.name || prev.name,
          email: updateData.email || prev.email
        } : null);
      }
      
      setUpdateSuccess('Profil mis à jour avec succès');
      
      // Si le mot de passe a été changé, déconnexion pour nouvelle connexion
      if (updateData.password) {
        setTimeout(() => {
          logout();
        }, 2000);
      } else {
        setTimeout(() => {
          handleCloseEditDialog();
        }, 2000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setUpdateError('Une erreur est survenue lors de la mise à jour du profil');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            color: textColor,
            display: 'flex',
            alignItems: 'center',
            mb: 3
          }}
        >
          <PersonIcon sx={{ mr: 1, color: primaryColor }} />
          Mon profil
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3, 
            color: alpha(textColor, 0.8),
            fontFamily: '"Poppins", sans-serif'
          }}
        >
          Gérez vos informations personnelles.
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
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

      {loading ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            my: 8 
          }}
        >
          <CircularProgress sx={{ color: primaryColor, mb: 2 }} />
          <Typography 
            variant="body1" 
            sx={{ 
              color: alpha(textColor, 0.8),
              fontFamily: '"Poppins", sans-serif'
            }}
          >
            Chargement de votre profil...
          </Typography>
        </Box>
      ) : user ? (
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                bgcolor: '#fff',
                height: '100%',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexDirection: 'column' }}>
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    bgcolor: primaryColor,
                    fontSize: '2.5rem',
                    mb: 2,
                    boxShadow: '0 4px 10px rgba(255, 107, 53, 0.3)'
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : ''}
                </Avatar>
                <Typography 
                  variant="h5"
                  sx={{ 
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 600,
                    color: textColor,
                    textAlign: 'center'
                  }}
                >
                  {user.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: alpha(textColor, 0.7),
                    fontFamily: '"Poppins", sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 1
                  }}
                >
                  <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, color: alpha(textColor, 0.5) }} />
                  Membre depuis {formatDate(user.created_at)}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <List sx={{ mb: 3 }}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary={
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          color: alpha(textColor, 0.6),
                          fontFamily: '"Poppins", sans-serif',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <EmailIcon sx={{ fontSize: 18, mr: 1, color: primaryColor }} />
                        Email
                      </Typography>
                    } 
                    secondary={
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontFamily: '"Poppins", sans-serif',
                          color: textColor,
                          mt: 0.5
                        }}
                      >
                        {user.email}
                      </Typography>
                    } 
                  />
                </ListItem>
              </List>

              <Button 
                variant="contained" 
                fullWidth 
                onClick={handleOpenEditDialog}
                startIcon={<EditIcon />}
                sx={{ 
                  bgcolor: primaryColor,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 500,
                  py: 1.2,
                  boxShadow: '0 4px 10px rgba(255, 107, 53, 0.3)',
                  '&:hover': {
                    bgcolor: alpha(primaryColor, 0.9),
                    boxShadow: '0 6px 15px rgba(255, 107, 53, 0.4)',
                  }
                }}
              >
                Modifier mon profil
              </Button>
            </Paper>
          </Grid>
        </Grid>
      ) : null}

      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseEditDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 500,
            width: '100%'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            color: textColor,
            pb: 1
          }}
        >
          Modifier mon profil
        </DialogTitle>
        <DialogContent>
          {updateError && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#D32F2F'
                }
              }}
            >
              {updateError}
            </Alert>
          )}
          {updateSuccess && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 2,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#2E7D32'
                }
              }}
            >
              {updateSuccess}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Nom"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused fieldset': {
                  borderColor: primaryColor,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: primaryColor,
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: alpha(textColor, 0.6) }} />
                </InputAdornment>
              )
            }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused fieldset': {
                  borderColor: primaryColor,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: primaryColor,
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: alpha(textColor, 0.6) }} />
                </InputAdornment>
              )
            }}
          />
          <TextField
            margin="dense"
            label="Nouveau mot de passe"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused fieldset': {
                  borderColor: primaryColor,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: primaryColor,
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: alpha(textColor, 0.6) }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                                        aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? 
                      <VisibilityOffIcon sx={{ color: alpha(textColor, 0.6) }} /> : 
                      <VisibilityIcon sx={{ color: alpha(textColor, 0.6) }} />
                    }
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            margin="dense"
            label="Confirmer le mot de passe"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={password !== confirmPassword && confirmPassword !== ''}
            helperText={password !== confirmPassword && confirmPassword !== '' ? "Les mots de passe ne correspondent pas" : ""}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused fieldset': {
                  borderColor: primaryColor,
                },
                '&.Mui-error fieldset': {
                  borderColor: '#d32f2f',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: primaryColor,
              },
              '& .MuiInputLabel-root.Mui-error': {
                color: '#d32f2f',
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: alpha(textColor, 0.6) }} />
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseEditDialog} 
            sx={{ 
              color: alpha(textColor, 0.7),
              textTransform: 'none',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 500,
              borderRadius: 2,
              '&:hover': {
                bgcolor: alpha(textColor, 0.05)
              }
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleUpdateProfile} 
            variant="contained"
            sx={{ 
              bgcolor: primaryColor,
              borderRadius: 2,
              textTransform: 'none',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 500,
              boxShadow: '0 4px 10px rgba(255, 107, 53, 0.3)',
              '&:hover': {
                bgcolor: alpha(primaryColor, 0.9),
                boxShadow: '0 6px 15px rgba(255, 107, 53, 0.4)',
              }
            }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default ProfilePage;

