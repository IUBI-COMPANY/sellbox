'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        <label
          htmlFor={checkboxId}
          className="flex items-start gap-3 cursor-pointer group select-none text-sm text-foreground"
        >
          <div className="relative flex items-center justify-center mt-0.5 shrink-0">
            <input
              type="checkbox"
              ref={ref}
              id={checkboxId}
              className="peer sr-only"
              {...props}
            />
            {/* Custom Checkbox Square */}
            <div className={`
              w-5 h-5 rounded-md border border-border bg-card
              transition-all duration-200
              peer-focus:ring-2 peer-focus:ring-accent/55 peer-focus:border-accent/55
              peer-checked:bg-accent peer-checked:border-accent
              group-hover:border-border-hover
              peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
              flex items-center justify-center
              peer-checked:[&_svg]:scale-100 peer-checked:[&_svg]:opacity-100
              ${error ? 'border-danger/55 peer-focus:ring-danger/55' : ''}
              ${className}
            `.trim()}>
              <Check className="w-3.5 h-3.5 text-white scale-50 opacity-0 transition-all duration-200 pointer-events-none" />
            </div>
          </div>
          {label && (
            <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {label}
            </span>
          )}
        </label>
        {error && (
          <p className="mt-1.5 text-xs text-danger pl-8">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
