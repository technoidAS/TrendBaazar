import { useState, useEffect } from 'react';

/**
 * Custom hook for reading/writing values in localStorage with React state synchronization.
 * @param {string} key - The localStorage key name
 * @param {*} initialValue - The fallback value if none exists
 */
export function useLocalStorage(key, initialValue) {
  // Read value from local storage on mount
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Set local storage value
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
export default useLocalStorage;
