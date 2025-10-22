import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { User, Achievement } from '../types';
import { MOCK_USERS_DATA } from '../constants';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>, pictureFile?: File | null) => Promise<void>;
  addAchievement: (achievement: Achievement) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_API_DELAY = 500; // ms

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      setToken(currentToken);
      // --- MOCK BACKEND ---
      await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY / 2));
      if (currentToken === 'admin-token') {
        setUser(MOCK_USERS_DATA.find(u => u.role === 'admin')!);
      } else if (currentToken.startsWith('member-token')) {
        // For new registrations, create a temporary user object
        if(currentToken.includes('|')){
           const [_, name, email] = currentToken.split('|');
           setUser({
                id: `user-${Date.now()}`,
                name,
                email,
                role: 'member',
                achievements: [],
                profilePicture: `https://picsum.photos/seed/${email}/200`,
           });
        } else {
            setUser(MOCK_USERS_DATA.find(u => u.role === 'member')!);
        }
      } else {
        // Invalid token
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
      // --- END MOCK BACKEND ---
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const register = async (name: string, email: string, password: string) => {
    // --- MOCK BACKEND ---
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    // In a real app, you'd check if the email is already taken.
    const mockToken = `member-token|${name}|${email}`; // Store name/email for mock user creation
    localStorage.setItem('token', mockToken);
    setToken(mockToken);
    await loadUser();
    // --- END MOCK BACKEND ---
  };

  const login = async (email: string, password: string) => {
     // --- MOCK BACKEND ---
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    if (password === 'password') {
        if (email === 'admin@foty.org') {
            localStorage.setItem('token', 'admin-token');
            setToken('admin-token');
            await loadUser();
            return;
        }
        if (email === 'member@foty.org') {
            localStorage.setItem('token', 'member-token');
            setToken('member-token');
            await loadUser();
            return;
        }
    }
    throw new Error("Invalid credentials");
     // --- END MOCK BACKEND ---
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = async (data: Partial<User>, pictureFile?: File | null) => {
    // --- MOCK BACKEND ---
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    setUser(currentUser => {
        if (!currentUser) return null;
        let profilePicture = currentUser.profilePicture;
        if (pictureFile) {
            // In a real app, you'd upload this and get a URL.
            // Here, we'll just use a local object URL for the preview.
            profilePicture = URL.createObjectURL(pictureFile);
        }
        const updatedUser = { ...currentUser, ...data, profilePicture };
        // Note: This mock update won't persist across page reloads.
        return updatedUser;
    });
     // --- END MOCK BACKEND ---
  };

  const addAchievement = async (achievement: Achievement) => {
    // --- MOCK BACKEND ---
    await new Promise(resolve => setTimeout(resolve, 100)); // Quick update
    setUser(currentUser => {
      if (!currentUser || currentUser.achievements.some(a => a.id === achievement.id)) {
        return currentUser;
      }
      return {
        ...currentUser,
        achievements: [...currentUser.achievements, achievement],
      };
    });
    // --- END MOCK BACKEND ---
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isLoading,
        register,
        login,
        logout,
        updateUser,
        addAchievement,
      }}
    >
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
