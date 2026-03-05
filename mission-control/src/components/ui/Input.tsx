'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'search';
  icon?: React.ReactNode;
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', icon, label, error, className, style, ...props }, ref) => {
    const baseStyles: React.CSSProperties = {
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: variant === 'search' ? 'var(--radius-full)' : 'var(--radius-md)',
      padding: variant === 'search' ? '12px 16px 12px 44px' : '12px 16px',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-body)',
      fontSize: '0.9375rem',
      outline: 'none',
      transition: 'all var(--duration-fast) var(--ease-out-expo)',
      width: '100%',
    };

    const [isFocused, setIsFocused] = React.useState(false);

    const focusStyles: React.CSSProperties = {
      borderColor: 'var(--accent)',
      boxShadow: '0 0 0 3px var(--accent-muted), 0 0 20px var(--accent-glow)',
    };

    return (
      <div style={{ width: '100%' }}>
        {label && (
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-2)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {label}
          </label>
        )}

        <div style={{ position: 'relative' }}>
          {variant === 'search' && (
            <div
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: isFocused ? 'var(--accent)' : 'var(--text-muted)',
                pointerEvents: 'none',
                transition: 'color var(--duration-fast) var(--ease-out-expo)',
              }}
            >
              {icon || (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              )}
            </div>
          )}

          <input
            ref={ref}
            className={className}
            style={{
              ...baseStyles,
              ...(isFocused ? focusStyles : {}),
              ...style,
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </div>

        {error && (
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--danger)',
              marginTop: 'var(--space-2)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
