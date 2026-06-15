import React from 'react';

/**
 * Animated SlideUp wrapper.
 */
export function SlideUp({ children, delay = 0, duration = '0.4s', className = '' }) {
  const style = {
    animationDelay: `${delay}ms`,
    animationDuration: duration,
  };

  return (
    <div className={`anim-slide-up ${className}`} style={style}>
      {children}
    </div>
  );
}

export default SlideUp;
