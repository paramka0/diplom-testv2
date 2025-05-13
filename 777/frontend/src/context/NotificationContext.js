import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback(({ type, title, message, duration }) => {
    setNotification({ type, title, message, duration });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const showSuccess = useCallback((message, title = 'Успешно') => {
    showNotification({ type: 'success', title, message });
  }, [showNotification]);

  const showError = useCallback((message, title = 'Ошибка') => {
    showNotification({ type: 'error', title, message });
  }, [showNotification]);

  const showInfo = useCallback((message, title = 'Информация') => {
    showNotification({ type: 'info', title, message });
  }, [showNotification]);

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      {notification && (
        <Notification
          {...notification}
          onClose={hideNotification}
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
} 