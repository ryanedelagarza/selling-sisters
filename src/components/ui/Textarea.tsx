import { TextareaHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import CharacterCounter from './CharacterCounter';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  maxLength?: number;
  showCounter?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, maxLength, showCounter = true, className, id, value, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          className={clsx(
            'w-full px-4 py-3 rounded-lg border font-body text-base text-gray-700',
            'placeholder:text-gray-400 resize-none',
            'focus:outline-none focus:ring-2 transition-colors duration-200',
            'min-h-[120px]',
            error
              ? 'border-error focus:border-error focus:ring-red-100'
              : 'border-gray-200 focus:border-primary focus:ring-primary-light',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />
        <div className="flex justify-between items-start mt-1">
          <div className="flex-1">
            {error && (
              <p id={`${textareaId}-error`} className="error-message" role="alert">
                {error}
              </p>
            )}
            {hint && !error && (
              <p id={`${textareaId}-hint`} className="text-sm text-gray-500">
                {hint}
              </p>
            )}
          </div>
          {showCounter && maxLength && (
            <CharacterCounter current={currentLength} max={maxLength} />
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
