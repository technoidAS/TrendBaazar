# TrendBaazar - Futuristic React E-Commerce Website

TrendBaazar is a next-generation React e-commerce application built using **React**, **Vite**, **Context API**, and **Vanilla CSS**. It features a modern dark/light responsive interface, glassmorphism card layouts, and premium micro-animations.

## Key Features

1. **Vanilla CSS Styling & Design Tokens**: Uses harmonized HSL colors, sizing parameters, Outfit/Plus Jakarta Sans Google Fonts, card elevations, and custom scrolling containers.
2. **Context API State Engine**: Full states management decoupled from Redux using React contexts:
   - `AuthContext`: Manages login, registrations, and profile modifications.
   - `CartContext`: Handles item additions, quantity adjusters, and price coupon calculations.
   - `ProductContext`: Holds listings, advanced sidebar filters (category, rating, price sliders), and wishlists.
   - `ThemeContext`: Toggles dark/light modes.
3. **Decoupled Data Provider (`dp/`) Layer**: Dynamic switching between simulated local storage database and REST APIs depending on environmental configurations (`VITE_DATA_SOURCE=local` vs `api`).
4. **Stepped Secure Checkout**: Follows a three-phase workflow (Shipping -> Payment -> Confirmation HUD) with validation guards.
5. **SEO Optimized**: Standardized semantics elements and title tag configs.

---

## Folder Structure

```
ecommerce-app/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── favicon.ico
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   ├── fonts/
│   │   └── animations/
│   │
│   ├── theme/
│   │   ├── colors.css
│   │   ├── variables.css
│   │   ├── typography.css
│   │   └── theme.css
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── reset.css
│   │   ├── utilities.css
│   │   └── animations.css
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/ (Button.jsx & Button.css)
│   │   │   ├── Input/ (Input.jsx & Input.css)
│   │   │   ├── Modal/ (Modal.jsx & Modal.css)
│   │   │   ├── Loader/ (Loader.jsx & Loader.css)
│   │   │   └── Pagination/ (Pagination.jsx & Pagination.css)
│   │   ├── layout/
│   │   │   ├── Navbar/ (Navbar.jsx & Navbar.css)
│   │   │   ├── Footer/ (Footer.jsx & Footer.css)
│   │   │   ├── Sidebar/ (Sidebar.jsx & Sidebar.css)
│   │   │   └── Layout.jsx
│   │   └── animations/
│   │       ├── FadeIn.jsx
│   │       └── SlideUp.jsx
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── ProductListing/
│   │   ├── ProductDetails/
│   │   ├── Cart/
│   │   ├── Wishlist/
│   │   ├── Checkout/
│   │   ├── Login/
│   │   └── Profile/
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   │
│   ├── services/
│   │   ├── api/ (axiosInstance, interceptors, endpoints)
│   │   ├── dp/ (localProvider, apiProvider, dpSelector)
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── cartService.js
│   │   └── orderService.js
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── ProductContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useDebounce.js
│   │   └── useLocalStorage.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── package.json
├── vite.config.js
└── README.md
```

---

## How to Get Started

### 1. Configure the Environment
Ensure your local settings in `.env` are configured. By default, `VITE_DATA_SOURCE` is set to `local` to utilize browser storage.
```env
VITE_DATA_SOURCE=local
VITE_API_URL=https://api.trendbaazar.mock/api
```
*Switch `VITE_DATA_SOURCE=api` to route service requests to a live endpoint instead.*

### 2. Install Dependencies
Run from the root of `ecommerce-app`:
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build Production Bundle
```bash
npm run build
```
