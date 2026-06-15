import { useState, useEffect } from 'react';

/**
 * Hook to debounce value updates.
 * @param {*} value - The input value to debounce
 * @param {number} delay - Debounce duration in milliseconds
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
export default useDebounce;
