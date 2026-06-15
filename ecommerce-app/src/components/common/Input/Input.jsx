import React from 'react';
import './Input.css';

/**
 * Standardized form inputs.
 * @param {string} label - Input label
 * @param {string} error - Error message
 * @param {React.ReactNode} iconLeft - Left side accessory icon
 * @param {React.ReactNode} iconRight - Right side accessory icon
 */
export function Input({
  label,
  error,
  iconLeft,
  iconRight,
  type = 'text',
  id,
  className = '',
  ...props
}) {
  const inputId = id || `input_${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`input-group ${error ? 'input-has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {iconLeft && <span className="input-icon input-icon-left">{iconLeft}</span>}
        <input
          type={type}
          id={inputId}
          className={`input-field ${iconLeft ? 'input-pad-left' : ''} ${
            iconRight ? 'input-pad-right' : ''
          }`}
          {...props}
        />
        {iconRight && <span className="input-icon input-icon-right">{iconRight}</span>}
      </div>
      {error && <span className="input-error-msg anim-slide-down">{error}</span>}
    </div>
  );
}

export default Input;
