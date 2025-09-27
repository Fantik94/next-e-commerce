'use client';

import * as React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

const toastVariants = {
  success: {
    icon: CheckCircle,
    className: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100',
    iconClassName: 'text-green-600 dark:text-green-400'
  },
  error: {
    icon: AlertCircle,
    className: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
    iconClassName: 'text-red-600 dark:text-red-400'
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100',
    iconClassName: 'text-yellow-600 dark:text-yellow-400'
  },
  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100',
    iconClassName: 'text-blue-600 dark:text-blue-400'
  }
};

export function Toast({ id, title, description, type = 'info', duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);
  const [progress, setProgress] = React.useState(100);
  const [isPaused, setIsPaused] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const progressIntervalRef = React.useRef<NodeJS.Timeout>();
  const startTimeRef = React.useRef<number>();
  const pausedTimeRef = React.useRef<number>(0);

  const variant = toastVariants[type];
  const Icon = variant.icon;

  // Animation d'entrée
  React.useEffect(() => {
    // Délai pour déclencher l'animation d'entrée
    const enterTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(enterTimeout);
  }, []);

  // Gestion du timer et de la barre de progression
  React.useEffect(() => {
    if (duration <= 0 || !isVisible) return;

    startTimeRef.current = Date.now();
    
    const startProgress = () => {
      const interval = 50; // Mise à jour toutes les 50ms
      
      progressIntervalRef.current = setInterval(() => {
        if (isPaused) return;
        
        const elapsed = Date.now() - (startTimeRef.current || 0) - pausedTimeRef.current;
        const remaining = Math.max(0, duration - elapsed);
        const newProgress = (remaining / duration) * 100;
        
        setProgress(newProgress);
        
        if (remaining <= 0) {
          handleClose();
        }
      }, interval);
    };

    startProgress();

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [duration, isVisible, isPaused]);

  const handleClose = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (startTimeRef.current) {
      pausedTimeRef.current += Date.now() - startTimeRef.current;
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startTimeRef.current = Date.now();
  };

  if (!isVisible && !isExiting) {
    return null;
  }

  return (
    <div
      className={cn(
        'pointer-events-auto relative flex w-full max-w-sm flex-col overflow-hidden rounded-lg border shadow-lg',
        variant.className,
        isVisible && !isExiting && 'toast-enter',
        isExiting && 'toast-exit'
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Barre de progression */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10">
        <div 
          className={cn(
            'h-full transition-all duration-75 ease-linear relative overflow-hidden',
            type === 'success' && 'bg-green-500',
            type === 'error' && 'bg-red-500', 
            type === 'warning' && 'bg-yellow-500',
            type === 'info' && 'bg-blue-500'
          )}
          style={{ 
            width: `${progress}%`,
            transition: isPaused ? 'none' : 'width 75ms linear'
          }}
        >
          {/* Effet shimmer sur la barre de progression */}
          <div className="absolute inset-0 progress-bar-shimmer" />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex items-start gap-3 p-4">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', variant.iconClassName)} />
        
        <div className="flex-1 space-y-1">
          {title && (
            <div className="text-sm font-semibold leading-none">
              {title}
            </div>
          )}
          {description && (
            <div className="text-sm opacity-90">
              {description}
            </div>
          )}
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fermer</span>
        </button>
      </div>
    </div>
  );
}
