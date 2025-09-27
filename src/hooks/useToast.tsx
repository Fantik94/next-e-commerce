'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast, type ToastProps } from '@/components/ui/toast';

interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
  showWarning: (title: string, description?: string) => void;
  showInfo: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: () => removeToast(id),
    };
    
    setToasts(prev => [...prev, newToast]);
  };

  const showSuccess = (title: string, description?: string) => {
    showToast({ type: 'success', title, description });
  };

  const showError = (title: string, description?: string) => {
    showToast({ type: 'error', title, description });
  };

  const showWarning = (title: string, description?: string) => {
    showToast({ type: 'warning', title, description });
  };

  const showInfo = (title: string, description?: string) => {
    showToast({ type: 'info', title, description });
  };

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Container des toasts */}
      <div className="pointer-events-none fixed top-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:top-4 sm:right-4 sm:max-w-sm sm:flex-col">
        {toasts.map((toast, index) => (
          <div 
            key={toast.id} 
            className="mb-2 last:mb-0"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <Toast {...toast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
