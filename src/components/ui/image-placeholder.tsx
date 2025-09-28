'use client';

import { cn } from '@/lib/utils';

interface ImagePlaceholderProps {
  width: number;
  height: number;
  className?: string;
  text?: string;
  type?: 'product' | 'category';
}

export function ImagePlaceholder({ 
  width, 
  height, 
  className, 
  text = 'Image non disponible',
  type = 'product'
}: ImagePlaceholderProps) {
  const colors = {
    product: {
      bg: 'bg-gray-100',
      icon: 'text-gray-400',
      text: 'text-gray-500'
    },
    category: {
      bg: 'bg-blue-50',
      icon: 'text-blue-400',
      text: 'text-blue-600'
    }
  };

  const currentColors = colors[type];

  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg',
        currentColors.bg,
        className
      )}
      style={{ width, height }}
    >
      <svg
        className={cn('w-12 h-12 mb-2', currentColors.icon)}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span className={cn('text-sm text-center px-2', currentColors.text)}>
        {text}
      </span>
    </div>
  );
}
