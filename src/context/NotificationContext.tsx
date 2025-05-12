// context/NotificationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Notification = {
  id: number;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
};

type NotificationContextType = {
  showNotification: (message: string, severity: Notification['severity']) => void;
  notifications: Notification[];
  removeNotification: (id: number) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, severity: Notification['severity']) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, severity }]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification, notifications, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
