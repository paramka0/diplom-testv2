import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const icons = {
  success: '✅',
  error: '❌',
  info: 'ℹ️'
};

function Notification({ type, title, message, onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return createPortal(
    <div className={`notification ${type}`}>
      <span className="notification-icon">{icons[type]}</span>
      <div className="notification-content">
        <div className="notification-title">{title}</div>
        <div className="notification-message">{message}</div>
      </div>
    </div>,
    document.body
  );
}

export default Notification; 