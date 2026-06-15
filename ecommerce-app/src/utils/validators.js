/**
 * Form validator utility functions.
 */

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return '';
};

export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return '';
};

export const validateCreditCard = (cardNumber) => {
  if (!cardNumber) return 'Card number is required';
  const cleanNumber = cardNumber.replace(/\s+/g, '');
  if (!/^\d{16}$/.test(cleanNumber)) return 'Card number must be 16 digits';
  return '';
};

export const validateExpiry = (expiry) => {
  if (!expiry) return 'Expiration date is required';
  if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry)) {
    return 'Expiration must be in MM/YY format';
  }
  return '';
};

export const validateCVV = (cvv) => {
  if (!cvv) return 'CVV is required';
  if (!/^\d{3,4}$/.test(cvv)) return 'CVV must be 3 or 4 digits';
  return '';
};
