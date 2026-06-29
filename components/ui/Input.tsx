'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  rightAction?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightAction, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 dark:text-muted-foreground mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full bg-neutral-50/50 dark:bg-card border border-neutral-300 dark:border-border rounded-xl
              px-4 py-2.5 text-sm text-foreground
              placeholder:text-neutral-400 dark:placeholder:text-muted-foreground/60
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50
              hover:border-neutral-400 dark:hover:border-border-hover
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-10' : ''}
              ${rightAction ? 'pr-10' : ''}
              ${error ? 'border-danger/50 focus:ring-danger/50 focus:border-danger/50' : ''}
              ${className}
            `.trim()}
            {...props}
          />
          {rightAction && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
              {rightAction}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
