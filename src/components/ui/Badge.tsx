'use client';

import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'kit' | 'pathium' | 'elysium';
  size?: 'sm' | 'md';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className,
  style,
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-1)',
    padding: size === 'sm' ? '4px 10px' : '6px 14px',
    borderRadius: 'var(--radius-full)',
    fontSize: size === 'sm' ? '0.625rem' : '0.6875rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontFamily: 'var(--font-body)',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: 'var(--bg-hover)',
      color: 'var(--text-secondary)',
    },
    accent: {
      background: 'var(--accent-muted)',
      color: 'var(--accent)',
      boxShadow: '0 0 12px var(--accent-glow)',
    },
    success: {
      background: 'var(--success-bg)',
      color: 'var(--success)',
    },
    warning: {
      background: 'var(--warning-bg)',
      color: 'var(--warning)',
    },
    danger: {
      background: 'var(--danger-bg)',
      color: 'var(--danger)',
    },
    info: {
      background: 'var(--info-bg)',
      color: 'var(--info)',
    },
    kit: {
      background: 'var(--kit-bg)',
      color: 'var(--kit)',
    },
    pathium: {
      background: 'var(--pathium-bg)',
      color: 'var(--pathium)',
    },
    elysium: {
      background: 'var(--elysium-bg)',
      color: 'var(--elysium)',
    },
  };

  return (
    <span
      className={className}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
