'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-muted-foreground mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full bg-card border border-border rounded-xl
            px-4 py-2.5 text-sm text-foreground
            placeholder:text-muted
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50
            hover:border-border-hover
            disabled:opacity-50 disabled:cursor-not-allowed
            min-h-[100px] resize-y
            ${error ? 'border-danger/50 focus:ring-danger/50 focus:border-danger/50' : ''}
            ${className}
          `.trim()}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
