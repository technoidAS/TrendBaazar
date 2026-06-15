/**
 * Utility helper functions.
 */

// Generate a random string ID
export const generateId = (prefix = 'id') => {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
};

// Delay execution (useful to simulate API calls in mocks)
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Format a date string
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Calculate cart totals
export const calculateCartTotals = (items, promoCode = '') => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  let discount = 0;
  if (promoCode.toUpperCase() === 'TRENDBAZAR20') {
    discount = subtotal * 0.20; // 20% discount
  } else if (promoCode.toUpperCase() === 'WELCOME10') {
    discount = subtotal * 0.10; // 10% discount
  }

  const discountedSubtotal = subtotal - discount;
  const tax = discountedSubtotal * 0.08;
  
  const shipping = subtotal > 99 || subtotal === 0 ? 0 : 9.99;
  const total = discountedSubtotal + tax + shipping;

  return {
    subtotal,
    discount,
    tax,
    shipping,
    total,
  };
};
