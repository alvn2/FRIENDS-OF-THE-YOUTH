// src/context/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import apiClient from '../services/api';

// Define the shape of your User object (from /users/profile)
interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  phone?: string | null;
  bio?: string | null;
  // This matches the shape from your backend middleware.js file
  badges?: Array<{ awardedAt: string; badge: { id: string; name: string; description: string; iconUrl: string } }>;
  donations?: Array<{ id: string; amount: number; createdAt: string; status: string }>;
  rsvps?: Array<{ rsvpAt: string; event: { id: string; name: string; date: string } }>;
}

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
  // This function is for your SettingsPage to update the user in the context
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | undefined>(undefined); // Start as undefined
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect 1: Runs ONCE on app load to check for existing token
  useEffect(() => {
    console.log("[DEBUG] AuthProvider Mount: Initial check.");
    let initialToken: string | null = null;
    const fullUrl = window.location.href;
    const searchParams = new URLSearchParams(window.location.search);
    let urlToken = searchParams.get('token');

    // Handle tokens in hash (from Google Redirect)
    if (!urlToken && fullUrl.includes('#') && fullUrl.includes('?')) {
      const hashPart = fullUrl.split('#')[1];
      const hashQueryString = hashPart.split('?')[1];
      if (hashQueryString) {
        const hashParams = new URLSearchParams(hashQueryString);
        urlToken = hashParams.get('token');
        console.log("[DEBUG] AuthProvider Mount: Found token in hash:", urlToken);
      }
    }

    if (urlToken) {
      console.log("[DEBUG] AuthProvider Mount: Using token from URL.");
      initialToken = urlToken;
      localStorage.setItem('token', initialToken);
      // Clean the token from the URL
      const pathBeforeHash = window.location.pathname;
      const hashPath = window.location.hash.split('?')[0];
      window.history.replaceState({}, document.title, pathBeforeHash + hashPath);
    } else {
      // No URL token, check localStorage
      initialToken = localStorage.getItem('token');
      console.log("[DEBUG] AuthProvider Mount: No URL token. Token from localStorage:", initialToken);
    }

    // Set the token state. This will trigger Effect 2.
    setToken(initialToken);

    // If there's no token at all, we're done loading.
    if (!initialToken) {
        console.log("[DEBUG] AuthProvider Mount: No initial token. Setting isLoading=false.");
        setIsLoading(false);
        setUser(null);
    }
  }, []);

  // Effect 2: Runs whenever the 'token' state changes.
  // This is now the SINGLE SOURCE OF TRUTH for fetching user data.
  useEffect(() => {
    const loadUserFromToken = async () => {
      // Only run if token is a string (not undefined or null)
      if (typeof token === 'string' && token) {
        console.log("[DEBUG] AuthProvider (useEffect[token]): Token exists. Fetching profile...");
        setIsLoading(true); // Set loading true *before* the fetch
        try {
          // The apiClient interceptor will automatically add the 'Bearer' header
          const response = await apiClient.get('/users/profile');
          console.log("[DEBUG] AuthProvider (useEffect[token]): Profile fetched:", response.data.data);
          setUser(response.data.data);
        } catch (error: any) {
          console.error('[DEBUG] AuthProvider (useEffect[token]): Failed to fetch profile. Logging out.', error.response?.data || error.message);
          // The 401 interceptor in api.ts will catch this, but this is a good fallback.
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        } finally {
          console.log("[DEBUG] AuthProvider (useEffect[token]): Fetch finished. Setting isLoading=false.");
          setIsLoading(false);
        }
      } else if (token === null) { // Only run if token is explicitly null (meaning logged out or invalid)
        // If token is null, ensure user is null and we are not loading.
        console.log("[DEBUG] AuthProvider (useEffect[token]): Token is null. Ensuring user is null.");
        setUser(null);
        setIsLoading(false);
      }
      // If token is still `undefined`, we're waiting for Effect 1 to run.
    };

    // We check `token !== undefined` to avoid running on the initial `undefined` state
    if (token !== undefined) {
      loadUserFromToken();
    }
  }, [token]);

  // login() is now only responsible for getting and setting the TOKEN.
  const login = async (email: string, password: string) => {
    console.log("[DEBUG] AuthContext: Attempting login...");
    setIsLoading(true); // Set loading to true immediately
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token: newToken } = response.data;

      console.log("[DEBUG] AuthContext: Login successful. Setting token.");
      localStorage.setItem('token', newToken);
      setToken(newToken); // This will trigger Effect 2 to fetch the user
    } catch (error) {
      console.error("[DEBUG] AuthContext: Login failed:", error);
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      setIsLoading(false); // Make sure to stop loading on error
      throw error;
    }
  };

  // register() is now only responsible for getting and setting the TOKEN.
  const register = async (name: string, email: string, password: string, phone: string) => {
    console.log("[DEBUG] AuthContext: Attempting registration...");
    setIsLoading(true); // Set loading to true immediately
    try {
      const response = await apiClient.post('/auth/register', { name, email, password, phone });
      const { token: newToken } = response.data;

      console.log("[DEBUG] AuthContext: Registration successful. Setting token.");
      localStorage.setItem('token', newToken);
      setToken(newToken); // This will trigger Effect 2 to fetch the user
    } catch (error: any) {
      console.error("[DEBUG] AuthContext: Registration failed:", error.response?.data || error.message);
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      setIsLoading(false); // Make sure to stop loading on error
      throw error;
    }
  };

  const logout = () => {
    console.log("[DEBUG] AuthContext: Logging out.");
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    window.location.hash = '/login';
  };

  // Allows SettingsPage to refetch the user after an update
  const refetchUser = () => {
    console.log("[DEBUG] AuthContext: Forcing user refetch.");
    setToken(localStorage.getItem('token'));
  };

  // Log state changes for easier debugging
  useEffect(() => {
    console.log("%c[DEBUG] AuthContext State Change:", "color: blue; font-weight: bold;", { user: user ? user.email : null, token: token ? '***' : null, isLoading });
  }, [user, token, isLoading]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};