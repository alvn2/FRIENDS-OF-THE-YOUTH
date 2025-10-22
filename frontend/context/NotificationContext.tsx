import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Notification } from '../types';
import { MOCK_NOTIFICATIONS_DATA } from '../constants';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface NotificationContextType {
  addNotification: (message: string, type: ToastType, options?: { persistent?: boolean; persistentType?: Notification['type']; link?: string }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationDisplayContextType {
    toasts: Toast[];
    notifications: Notification[];
}

export const NotificationDisplayContext = createContext<NotificationDisplayContextType>({
    toasts: [],
    notifications: [],
});

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Mock fetching notifications for the logged-in user
    setNotifications(MOCK_NOTIFICATIONS_DATA);
  }, []);

  const addNotification = useCallback((
    message: string, 
    type: ToastType, 
    options: { persistent?: boolean; persistentType?: Notification['type']; link?: string } = { persistent: false }
  ) => {
    // Handle toast display
    const toastId = new Date().getTime();
    setToasts(prev => [...prev, { id: toastId, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(n => n.id !== toastId));
    }, 5000);

    // Handle persistent notification
    if (options.persistent) {
      const newNotification: Notification = {
        id: `notif-${new Date().getTime()}`,
        message,
        type: options.persistentType || 'announcement',
        timestamp: new Date().toISOString(),
        read: false,
        link: options.link,
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, markAsRead, markAllAsRead }}>
      <NotificationDisplayContext.Provider value={{ toasts, notifications }}>
        {children}
      </NotificationDisplayContext.Provider>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const useNotifications = () => {
  return useContext(NotificationDisplayContext);
};