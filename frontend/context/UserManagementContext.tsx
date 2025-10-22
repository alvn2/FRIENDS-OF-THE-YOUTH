import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { MOCK_USERS_DATA } from '../constants';

interface UserManagementContextType {
  users: User[];
  loading: boolean;
  addUser: (newUser: Omit<User, 'id' | 'achievements' | 'profilePicture'>) => void;
  updateUser: (updatedUser: User) => void;
  deleteUser: (userId: string) => void;
}

export const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

export const UserManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching users from an API
    setUsers(MOCK_USERS_DATA);
    setLoading(false);
  }, []);

  const addUser = (newUser: Omit<User, 'id' | 'achievements' | 'profilePicture'>) => {
    const userWithId: User = {
      ...newUser,
      id: `user-${new Date().getTime()}`,
      achievements: [],
      profilePicture: `https://i.pravatar.cc/150?u=${newUser.email}`,
    };
    setUsers(currentUsers => [userWithId, ...currentUsers]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(currentUsers =>
      currentUsers.map(user => (user.id === updatedUser.id ? updatedUser : user))
    );
  };
  
  const deleteUser = (userId: string) => {
    setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
  };


  return (
    <UserManagementContext.Provider value={{ users, loading, addUser, updateUser, deleteUser }}>
      {!loading && children}
    </UserManagementContext.Provider>
  );
};

export const useUserManagement = () => {
  const context = useContext(UserManagementContext);
  if (context === undefined) {
    throw new Error('useUserManagement must be used within a UserManagementProvider');
  }
  return context;
};