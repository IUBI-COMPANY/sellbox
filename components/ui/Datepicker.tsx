'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { Calendar } from 'lucide-react';

export interface DatepickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

const Datepicker = forwardRef<HTMLInputElement, DatepickerProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const pickerId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={pickerId}
            className="block text-sm font-medium text-muted-foreground mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Calendar className="w-5 h-5" />
          </div>
          <input
            type="date"
            ref={ref}
            id={pickerId}
            className={`
              w-full bg-card border border-border rounded-xl
              pl-10 pr-4 py-2.5 text-sm text-foreground
              placeholder:text-muted
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50
              hover:border-border-hover
              disabled:opacity-50 disabled:cursor-not-allowed
              dark:[color-scheme:dark] light:[color-scheme:light]
              ${error ? 'border-danger/50 focus:ring-danger/50 focus:border-danger/50' : ''}
              ${className}
            `.trim()}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Datepicker.displayName = 'Datepicker';

export default Datepicker;
