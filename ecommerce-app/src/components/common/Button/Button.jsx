import React from 'react';
import './Button.css';

/**
 * Standardized premium button.
 * @param {string} variant - 'primary', 'secondary', 'outlined', 'ghost'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {boolean} loading - render a spinner state
 * @param {React.ReactNode} iconLeft - icon placed before children
 * @param {React.ReactNode} iconRight - icon placed after children
 */
export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  className = '',
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${loading ? 'btn-loading' : ''} ${className}`}
      onClick={onClick}
      disabled={isDisabled}
      {...props}
    >
      <span className="btn-liquid-bg"></span>
      {loading && <span className="btn-spinner"></span>}
      {!loading && iconLeft && <span className="btn-icon btn-icon-left">{iconLeft}</span>}
      <span className="btn-content">{children}</span>
      {!loading && iconRight && <span className="btn-icon btn-icon-right">{iconRight}</span>}
    </button>
  );
}

export default Button;
