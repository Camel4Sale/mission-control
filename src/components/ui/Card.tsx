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
    transform: 'translateY(-2px) scale(1.01)',
    boxShadow: 'var(--shadow-lg), 0 0 30px rgba(200, 255, 0, 0.05)',
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
      {/* Accent border for variant */}
      {variant === 'accent' && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '3px',
            background: 'var(--accent)',
            borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)',
          }}
        />
      )}

      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity var(--duration-normal) var(--ease-out-expo)',
        }}
      />

      {children}
    </div>
  );
};

export default Card;
