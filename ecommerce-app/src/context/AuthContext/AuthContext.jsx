import React, { createContext, useState, useEffect, useContext } from 'react';
import { STORAGE_KEYS } from '../../utils/constants';
import authService from '../../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Attempt auto-login if user token is stored locally
    try {
      const storedSession = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedSession) {
        const parsed = JSON.parse(storedSession);
        setUser(parsed.user);
      }
    } catch (e) {
      console.error('[Auth Context] Auto login parse failure:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const requestOtp = async (phone) => {
    setError(null);
    try {
      const result = await authService.requestOtp(phone);
      return result;
    } catch (err) {
      const msg = err.message || 'Failed to send OTP';
      setError(msg);
      throw new Error(msg);
    }
  };

  const signup = async (payload) => {
    setError(null);
    try {
      const result = await authService.signup(payload);
      return result;
    } catch (err) {
      const msg = err.message || 'Failed to create account';
      setError(msg);
      throw new Error(msg);
    }
  };

  const verifyOtp = async (phone, otp) => {
    setError(null);
    try {
      const data = await authService.verifyOtp(phone, otp);
      setUser(data.user);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));
      return data.user;
    } catch (err) {
      const msg = err.message || 'OTP verification failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const updateProfile = async (updatedFields) => {
    if (!user) return;
    try {
      const updatedUser = await authService.updateProfile(user.id, updatedFields);
      setUser(updatedUser);
      
      // Sync local storage token configuration
      const storedSession = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedSession) {
        const parsed = JSON.parse(storedSession);
        parsed.user = updatedUser;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(parsed));
      }
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        requestOtp,
        signup,
        verifyOtp,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};

export default AuthContext;
