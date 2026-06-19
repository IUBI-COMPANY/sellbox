'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  options: RadioOption[];
  direction?: 'row' | 'col';
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, options, direction = 'col', className = '', name, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <span className="block text-sm font-medium text-muted-foreground mb-2.5">
            {label}
          </span>
        )}
        <div className={`
          flex ${direction === 'row' ? 'flex-row flex-wrap gap-6' : 'flex-col gap-3.5'}
        `.trim()}>
          {options.map((opt) => {
            const radioId = `${name}-${opt.value}`;
            return (
              <label
                key={opt.value}
                htmlFor={radioId}
                className="flex items-start gap-3 cursor-pointer group select-none text-sm text-foreground"
              >
                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                  <input
                    type="radio"
                    ref={ref}
                    id={radioId}
                    name={name}
                    value={opt.value}
                    className="peer sr-only"
                    {...props}
                  />
                  {/* Custom Radio Circle */}
                  <div className={`
                    w-5 h-5 rounded-full border border-border bg-card
                    transition-all duration-200
                    peer-focus:ring-2 peer-focus:ring-accent/55 peer-focus:border-accent/55
                    peer-checked:border-accent
                    group-hover:border-border-hover
                    peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
                    flex items-center justify-center
                    peer-checked:[&_div]:scale-100 peer-checked:[&_div]:opacity-100
                    ${error ? 'border-danger/55 peer-focus:ring-danger/55' : ''}
                    ${className}
                  `.trim()}>
                    {/* Inner Circle indicator */}
                    <div className="w-2.5 h-2.5 rounded-full bg-accent scale-50 opacity-0 transition-all duration-200 pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {opt.label}
                  </span>
                  {opt.description && (
                    <span className="text-xs text-muted-foreground/75 mt-0.5">
                      {opt.description}
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;
