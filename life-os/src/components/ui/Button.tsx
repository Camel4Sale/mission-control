'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, loading, children, className, style, disabled, ...props }, ref) => {
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-2)',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-body)',
      fontWeight: '500',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      transition: 'all var(--duration-fast) var(--ease-out-expo)',
      border: 'none',
      outline: 'none',
      whiteSpace: 'nowrap',
      position: 'relative',
      overflow: 'hidden',
      opacity: disabled || loading ? 0.5 : 1,
      transform: 'none',
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        background: 'var(--accent)',
        color: '#000000',
      },
      secondary: {
        background: 'var(--bg-surface)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-default)',
      },
      ghost: {
        background: 'transparent',
        color: 'var(--text-secondary)',
      },
      danger: {
        background: 'var(--danger)',
        color: '#ffffff',
      },
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: {
        padding: '10px 18px',
        fontSize: '0.8125rem',
      },
      md: {
        padding: '14px 28px',
        fontSize: '0.9375rem',
      },
      lg: {
        padding: '18px 36px',
        fontSize: '1.0625rem',
      },
    };

    const hoverStyles: React.CSSProperties = {
      transform: 'translateY(-2px)',
    };

    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={className}
        style={{
          ...baseStyles,
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...(isHovered && !disabled && !loading ? hoverStyles : {}),
          ...style,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin"
            style={{ width: '16px', height: '16px' }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && !loading && icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
