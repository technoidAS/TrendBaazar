import React from 'react';
import './Loader.css';

/**
 * Standardized progress loaders.
 * @param {string} type - 'spinner' (default), 'skeleton', 'fullscreen'
 * @param {string} size - 'sm', 'md', 'lg'
 */
export function Loader({ type = 'spinner', size = 'md', className = '', count = 1 }) {
  if (type === 'fullscreen') {
    return (
      <div className="loader-fullscreen">
        <div className="loader-fullscreen-box">
          <div className="loader-spin-logo"></div>
          <p className="loader-fullscreen-text anim-pulse">TrendBaazar</p>
        </div>
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className={`skeleton-container ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="skeleton-card">
            <div className="skeleton-element skeleton-image"></div>
            <div className="skeleton-element skeleton-title"></div>
            <div className="skeleton-element skeleton-text"></div>
            <div className="skeleton-element skeleton-price"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`loader-spinner-wrapper ${className}`}>
      <div className={`loader-spinner loader-spinner-${size}`}></div>
    </div>
  );
}

export default Loader;
