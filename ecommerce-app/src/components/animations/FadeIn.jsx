import React from 'react';

/**
 * Animated FadeIn wrapper.
 */
export function FadeIn({ children, delay = 0, duration = '0.3s', className = '' }) {
  const style = {
    animationDelay: `${delay}ms`,
    animationDuration: duration,
  };

  return (
    <div className={`anim-fade-in ${className}`} style={style}>
      {children}
    </div>
  );
}

export default FadeIn;
