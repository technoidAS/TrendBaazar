// API endpoint constants — these must match the backend controller routes exactly.
// All routes are prefixed with the VITE_API_URL base URL (e.g. http://localhost:5108/api).

export const endpoints = {
  // Auth endpoints (AuthController)
  OTP_REQUEST: '/auth/otp-request',   // POST - send OTP to phone
  OTP_VERIFY: '/auth/otp-verify',     // POST - verify OTP and receive JWT token
  ME: '/auth/me',                      // GET  - get current authenticated user (requires JWT)

  // Product endpoints (ProductController)
  PRODUCTS: '/products',               // GET  - list/filter products; GET /:id for single product
  PRODUCTS_FEATURED: '/products/featured', // GET  - featured products only
  PRODUCTS_BRANDS: '/products/brands',     // GET  - distinct brand names

  // Profile endpoints (ProfileController — requires JWT)
  PROFILE: '/profile',                 // PUT  - update own profile
  ADDRESSES: '/profile/addresses',     // GET/POST/PUT/:id/DELETE/:id

  // Cart endpoints (CartController — requires JWT)
  CART: '/cart',                       // GET - load cart; PUT - save cart; DELETE - clear cart

  // Order endpoints (OrderController — requires JWT)
  ORDERS: '/orders',                   // GET  - my orders; POST - place new order

  // Admin endpoints (AdminController — requires JWT + admin role)
  ADMIN_STATS: '/admin/stats',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
  ADMIN_PRODUCTS: '/admin/products',
};

export default endpoints;
