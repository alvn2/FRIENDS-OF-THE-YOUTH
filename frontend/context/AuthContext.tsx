import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback // Import useCallback
} from 'react';
// --- FIX: Correct relative path based on structure ---
import apiClient from '../services/api'; 
// ----------------------------------------------------

// Define the shape of your User object (match backend response)
// Ensure this matches the SELECT in backend middleware and controllers
interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  phone?: string | null; 
  bio?: string | null;   
  badges?: Array<any>; // Define more specific types if needed
  donations?: Array<any>;
  rsvps?: Array<any>;
  // Add other fields returned by backend profile route if necessary
}

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean; 
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  // Initial Load and Token Handling
  useEffect(() => {
    console.log("[DEBUG] AuthProvider Mount: Initial check.");
    let initialToken: string | null = null;
    const fullUrl = window.location.href;
    const searchParams = new URLSearchParams(window.location.search);
    let urlToken = searchParams.get('token');

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
      const pathBeforeHash = window.location.pathname;
      const hashPath = window.location.hash.split('?')[0]; 
      window.history.replaceState({}, document.title, pathBeforeHash + hashPath);
    } else {
      initialToken = localStorage.getItem('token');
      console.log("[DEBUG] AuthProvider Mount: No URL token. Token from localStorage:", initialToken);
    }

    setToken(initialToken);
    
    if (!initialToken) {
        console.log("[DEBUG] AuthProvider Mount: No initial token. Setting isLoading=false.");
        setIsLoading(false);
        setUser(null); 
    }

  }, []); 

  // User Fetching Effect
  useEffect(() => {
    const loadUserFromToken = async () => {
      const currentTokenInState = token;
      console.log("[DEBUG] AuthProvider (useEffect[token]): Token changed, checking state:", currentTokenInState);

      if (currentTokenInState) {
         if (!isLoading) setIsLoading(true); 
         
         try {
           console.log("[DEBUG] AuthProvider (useEffect[token]): Attempting to fetch profile...");
           // Use '/users/profile' - proxy prepends '/api/v1'
           const response = await apiClient.get('/users/profile'); 
           console.log("[DEBUG] AuthProvider (useEffect[token]): Profile fetched successfully:", response.data.data);
           setUser(response.data.data); 
           console.log("[DEBUG] AuthProvider (useEffect[token]): Setting isLoading=false after successful fetch.");
           setIsLoading(false); 
         } catch (error: any) {
           console.error('[DEBUG] AuthProvider (useEffect[token]): Failed to fetch profile:', error.response?.data || error.message);
           localStorage.removeItem('token');
           setUser(null); 
           setToken(null); 
           console.log("[DEBUG] AuthProvider (useEffect[token]): Setting isLoading=false after failed fetch.");
           setIsLoading(false); 
         }
      } else {
          console.log("[DEBUG] AuthProvider (useEffect[token]): Token is null. Ensuring user is null and isLoading=false.");
          setUser(null);
          if (isLoading) setIsLoading(false); 
      }
    };
    
    if (token !== undefined) { 
        loadUserFromToken();
    }

  }, [token]); 


  const login = async (email: string, password: string) => {
      console.log("[DEBUG] AuthContext: Attempting login...");
      setIsLoading(true); 
      try {
        // Use '/auth/login' - proxy prepends '/api/v1'
        const response = await apiClient.post('/auth/login', { email, password }); 
        const { token: newToken, user: loggedInUser } = response.data;
        console.log("[DEBUG] AuthContext: Login successful. Setting token and user state immediately:", newToken, loggedInUser);
        localStorage.setItem('token', newToken);
        setUser(loggedInUser); 
        setToken(newToken); 
      } catch (error) {
        console.error("[DEBUG] AuthContext: Login failed:", error);
        setUser(null); 
        setToken(null);
        setIsLoading(false); 
        throw error; 
      }
  };

  const register = async (name: string, email: string, password: string, phone: string) => {
    console.log("[DEBUG] AuthContext: Attempting registration...");
    setIsLoading(true); 
    try {
       // Use '/auth/register' - proxy prepends '/api/v1'
      const response = await apiClient.post('/auth/register', { name, email, password, phone }); 
      const { token: newToken, user: newUser } = response.data;
      console.log("[DEBUG] AuthContext: Registration successful. Setting token and user state immediately:", newToken, newUser);
      localStorage.setItem('token', newToken);
      setUser(newUser); 
      setToken(newToken); 
    } catch (error: any) {
        console.error("[DEBUG] AuthContext: Registration failed - Backend Response:", error.response?.data || error.message);
        setUser(null); 
        setToken(null);
        setIsLoading(false); 
        throw error; 
    }
  };

  const logout = () => {
    console.log("[DEBUG] AuthContext: Logging out.");
    setIsLoading(true); 
    localStorage.removeItem('token');
    setUser(null); 
    setToken(null); 
    window.location.href = '#/login'; 
  };

  useEffect(() => {
    console.log("%c[DEBUG] AuthContext State Change:", "color: blue; font-weight: bold;", { user: user ? user.email : null, token: token ? '***' : null, isLoading });
  }, [user, token, isLoading]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
       {isLoading ? <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2em'}}>Verifying Session...</div> : children}
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

