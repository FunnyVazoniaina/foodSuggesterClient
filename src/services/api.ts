import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true //Allows cookies to be sent with requests
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour logger les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response ? {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    } : error.message);
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    return api.post('/auth/register', { name, email, password });
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Services de recettes
export const recipeService = {
  suggestRecipes: async (ingredients: string) => {
    try {

      const response = await api.get('/recipes/suggest-with-details', {
        params: { ingredients }
      });
      return response.data;
    } catch (error) {
      console.error('Error in suggestRecipes:', error);
      throw error;
    }
  },
  addFavorite: async (recipeId: number, title: string, image_url: string) => {
    return api.post('/user/favorites', { recipeId, title, image_url });
  },
  getFavorites: async () => {
    const response = await api.get('/user/favorites');
    return response.data;
  },
  removeFavorite: async (recipeId: number) => {
    return api.delete(`/user/favorites/${recipeId}`);
  }
};

export const historyService = {
 
  getSearchHistory: async () => {
    // Utilisez l'URL complète au lieu de '/api/recipes/history'
    const response = await fetch('http://localhost:5000/api/recipes/history', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text(); // Utilisez text() au lieu de json() pour voir la réponse brute
      console.error('API Error Response:', errorText);
      throw new Error('Failed to fetch search history');
    }
    
    return response.json();
  },
  
  deleteHistoryItem: async (historyId: number) => {
    const response = await fetch(`/api/recipes/history/${historyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete history item');
    }
    
    return response.json();
  },
  
  clearHistory: async () => {
    const response = await fetch('/api/recipes/history', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to clear history');
    }
    
    return response.json();
  }
};

export const userService = {
  
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
  
    updateProfile: async (data: { name?: string; email?: string; password?: string }) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  }
};

export default api;
