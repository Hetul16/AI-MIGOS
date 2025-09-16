import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Toast = ({ 
  id,
  type = 'info', // 'success' | 'warning' | 'error' | 'info' | 'ai'
  title,
  message,
  duration = 5000,
  onClose,
  action = null,
  persistent = false
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, persistent]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose(id);
    }, 300);
  };

  const getToastStyles = () => {
    const baseStyles = "glass glass-hover border-l-4 shadow-prominent";
    
    switch (type) {
      case 'success':
        return `${baseStyles} border-l-success bg-success/5`;
      case 'warning':
        return `${baseStyles} border-l-warning bg-warning/5`;
      case 'error':
        return `${baseStyles} border-l-error bg-error/5`;
      case 'ai':
        return `${baseStyles} border-l-accent bg-accent/5 ai-glow`;
      default:
        return `${baseStyles} border-l-primary bg-primary/5`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      case 'ai':
        return 'Bot';
      default:
        return 'Info';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      case 'ai':
        return 'text-accent';
      default:
        return 'text-primary';
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        ${getToastStyles()}
        p-4 rounded-xl max-w-sm w-full transition-all duration-300 ease-spring
        ${isExiting ? 'opacity-0 transform translate-x-full scale-95' : 'opacity-100 transform translate-x-0 scale-100'}
        animate-slide-up
      `}
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 ${getIconColor()}`}>
          <Icon name={getIcon()} size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-sm font-caption font-caption-medium text-foreground mb-1">
              {title}
            </h4>
          )}
          <p className="text-sm text-muted-foreground font-caption leading-relaxed">
            {message}
          </p>
          
          {action && (
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={action?.onClick}
                className="text-xs h-8 px-3"
              >
                {action?.label}
              </Button>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          iconName="X"
          onClick={handleClose}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground w-6 h-6 p-0"
        />
      </div>
      {!persistent && duration > 0 && (
        <div className="mt-3">
          <div className="w-full bg-border/30 rounded-full h-1">
            <div
              className={`h-1 rounded-full transition-all ease-linear ${
                type === 'success' ? 'bg-success' :
                type === 'warning' ? 'bg-warning' :
                type === 'error' ? 'bg-error' :
                type === 'ai' ? 'bg-accent' : 'bg-primary'
              }`}
              style={{
                animation: `toast-progress ${duration}ms linear forwards`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const NotificationToast = () => {
  const [toasts, setToasts] = useState([]);

  // Global toast management functions
  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { ...toast, id }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev?.filter(toast => toast?.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  // Expose methods globally (you might want to use a context or state management library)
  useEffect(() => {
    window.showToast = addToast;
    window.clearToasts = clearAllToasts;
    
    return () => {
      delete window.showToast;
      delete window.clearToasts;
    };
  }, []);

  return (
    <div className="fixed top-20 right-6 z-90 space-y-3 max-w-sm">
      {toasts?.map((toast) => (
        <Toast
          key={toast?.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
      <style jsx>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

// Helper functions for easy toast creation
export const showSuccessToast = (message, title = 'Success') => {
  if (window.showToast) {
    window.showToast({
      type: 'success',
      title,
      message,
      duration: 4000
    });
  }
};

export const showErrorToast = (message, title = 'Error') => {
  if (window.showToast) {
    window.showToast({
      type: 'error',
      title,
      message,
      duration: 6000
    });
  }
};

export const showWarningToast = (message, title = 'Warning') => {
  if (window.showToast) {
    window.showToast({
      type: 'warning',
      title,
      message,
      duration: 5000
    });
  }
};

export const showInfoToast = (message, title = 'Info') => {
  if (window.showToast) {
    window.showToast({
      type: 'info',
      title,
      message,
      duration: 4000
    });
  }
};

export const showAIToast = (message, title = 'AI Assistant', action = null) => {
  if (window.showToast) {
    window.showToast({
      type: 'ai',
      title,
      message,
      duration: 7000,
      action
    });
  }
};

export const showPersistentToast = (message, type = 'info', title = null, action = null) => {
  if (window.showToast) {
    window.showToast({
      type,
      title,
      message,
      persistent: true,
      action
    });
  }
};

export default NotificationToast;