'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, error, className = '', id, ...props }, ref) => {
    const switchId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {label && (
              <label
                htmlFor={switchId}
                className="text-sm font-medium text-foreground cursor-pointer select-none"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5 select-none">{description}</p>
            )}
          </div>
          <label htmlFor={switchId} className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              ref={ref}
              id={switchId}
              className="sr-only peer"
              {...props}
            />
            <div className={`
              w-11 h-6 bg-border/60 rounded-full transition-all duration-200
              peer-focus:ring-2 peer-focus:ring-accent/50
              peer-checked:bg-accent
              peer-disabled:opacity-55 peer-disabled:cursor-not-allowed
              after:content-[''] after:absolute after:top-[2px] after:left-[2px]
              after:bg-white after:rounded-full after:h-5 after:w-5
              after:transition-all after:duration-200
              peer-checked:after:translate-x-full
              ${className}
            `.trim()} />
          </label>
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;
