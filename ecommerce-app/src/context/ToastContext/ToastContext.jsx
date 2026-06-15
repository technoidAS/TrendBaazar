import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, ShoppingBag, X } from 'lucide-react';
import './ToastContext.css';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} className="text-success" />;
      case 'error':
        return <XCircle size={18} className="text-error" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-warning" />;
      case 'cart':
        return <ShoppingBag size={18} className="text-brand" />;
      case 'cart-remove':
        return <ShoppingBag size={18} className="text-accent" />;
      case 'info':
      default:
        return <Info size={18} className="text-sec" />;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toaster-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-card toast-${toast.type} glass-panel anim-slide-in-left`}>
            <div className="toast-icon-wrapper flex justify-center align-center">
              {getIcon(toast.type)}
            </div>
            <div className="toast-content flex-grow text-left">
              <p className="toast-message">{toast.message}</p>
            </div>
            <button className="toast-close-btn flex justify-center align-center" onClick={() => removeToast(toast.id)} aria-label="Close toast">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside a ToastProvider');
  }
  return context;
};

export default ToastContext;
