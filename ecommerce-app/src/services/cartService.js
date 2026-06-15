import { STORAGE_KEYS } from '../utils/constants';
import { delay } from '../utils/helpers';
import dp from './dp/dpSelector';

// cartService delegates to the active data provider (local or api).
// In 'api' mode: cart is persisted in the backend DB under the user's account.
// In 'local' mode: cart is stored in localStorage per userId key.

export const cartService = {
  getCart: async (userId) => {
    // dp.getCart handles both modes:
    //   - api: GET /api/cart (returns items from DB)
    //   - local: reads from localStorage
    return dp.getCart(userId);
  },

  saveCart: async (userId, items) => {
    // dp.saveCart handles both modes:
    //   - api: PUT /api/cart (saves items to DB)
    //   - local: writes to localStorage
    return dp.saveCart(userId, items);
  },

  validatePromoCode: async (code) => {
    await delay(300);
    const validCodes = {
      'TRENDBAZAR20': { discountPercent: 20, description: '20% off your purchase!' },
      'WELCOME10': { discountPercent: 10, description: '10% welcome discount!' }
    };

    const promo = validCodes[code.toUpperCase()];
    if (!promo) throw new Error('Invalid or expired coupon code');
    return promo;
  }
};

export default cartService;
export const applyPromoCode = cartService.validatePromoCode;

