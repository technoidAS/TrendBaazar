/**
 * Formats a number to INR currency representation.
 * @param {number} amount - The currency numeric value
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    amount = 0;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
export default formatCurrency;
