import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/profile');
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch profile", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchProfile();
    
    // Listen for auth failures from axios interceptor
    const handleAuthFailure = () => {
        setUser(null);
    };
    window.addEventListener('auth-failed', handleAuthFailure);
    return () => window.removeEventListener('auth-failed', handleAuthFailure);
  }, []);

  const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 requires 'username'
    formData.append('password', password);
    
    // Send form data for oauth2 standard
    const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    localStorage.setItem('token', response.data.access_token);
    
    // Fetch user profile immediately after login
    const profileResponse = await api.get('/auth/profile');
    setUser(profileResponse.data);
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', response.data.access_token);
    
    // Fetch user profile immediately after login
    const profileResponse = await api.get('/auth/profile');
    setUser(profileResponse.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
