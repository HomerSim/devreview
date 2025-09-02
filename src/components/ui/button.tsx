import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            'bg-blue-500 text-white hover:bg-blue-600': variant === 'default',
            'text-gray-600 hover:text-gray-900 hover:bg-gray-100': variant === 'ghost',
            'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50': variant === 'outline',
          },
          {
            'px-4 py-2 text-sm sm:text-base': size === 'default',
            'px-2 py-1 text-sm': size === 'sm',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
