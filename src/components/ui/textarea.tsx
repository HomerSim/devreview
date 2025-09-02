import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  description?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, required, description, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          className={cn(
            "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent font-mono text-xs sm:text-sm transition-colors",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
          ref={ref}
          {...props}
        />
        {description && (
          <p className="text-xs sm:text-sm text-gray-500">{description}</p>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
