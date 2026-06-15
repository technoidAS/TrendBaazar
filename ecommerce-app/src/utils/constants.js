/* Configuration and application constants for TrendBaazar */

export const STORAGE_KEYS = {
  THEME: 'trendbaazar_theme',
  USER: 'trendbaazar_user',
  CART: 'trendbaazar_cart',
  WISHLIST: 'trendbaazar_wishlist',
  PRODUCTS: 'trendbaazar_products',
  ORDERS: 'trendbaazar_orders',
};

export const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 'apparel', name: 'Apparel' },
  { id: 'footwear', name: 'Footwear' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'gadgets', name: 'Gadgets' },
];

export const SORT_OPTIONS = [
  { id: 'featured', name: 'Featured' },
  { id: 'price-low-high', name: 'Price: Low to High' },
  { id: 'price-high-low', name: 'Price: High to Low' },
  { id: 'rating', name: 'Customer Rating' },
];

export const PAGINATION_LIMIT = 8;
export const TAX_RATE = 0.08; // 8% sales tax
export const SHIPPING_COST = 9.99;
export const FREE_SHIPPING_THRESHOLD = 99.00;
