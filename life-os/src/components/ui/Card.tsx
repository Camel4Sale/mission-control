'use client';

import React from 'react';

export interface CardProps {
  variant?: 'default' | 'elevated' | 'flat' | 'accent';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  className,
  style,
  children,
  hover = true,
}) => {
  const baseStyles: React.CSSProperties = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all var(--duration-normal) var(--ease-out-expo)',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {},
    elevated: {
      background: 'var(--bg-elevated)',
      boxShadow: 'var(--shadow-md)',
    },
    flat: {
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-subtle)',
    },
    accent: {
      position: 'relative',
    },
  };

  const hoverStyles: React.CSSProperties = {
    borderColor: 'var(--border-default)',
    transform: 'translateY(-3px)',
    boxShadow: 'var(--shadow-lg), 0 0 40px rgba(249, 115, 22, 0.08)',
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={className}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...(hover && isHovered ? hoverStyles : {}),
        ...style,
      }}
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Organic gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Accent border for variant */}
      {variant === 'accent' && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            background: 'linear-gradient(180deg, var(--accent), var(--accent-secondary))',
            borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)',
          }}
        />
      )}

      {children}
    </div>
  );
};

export default Card;
