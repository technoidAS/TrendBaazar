import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext/ToastContext.jsx';
import { AuthProvider } from './context/AuthContext/AuthContext.jsx';
import { ProductProvider } from './context/ProductContext/ProductContext.jsx';
import { CartProvider } from './context/CartContext/CartContext.jsx';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <ProductProvider>
              <CartProvider>
                <AppRoutes />
              </CartProvider>
            </ProductProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
