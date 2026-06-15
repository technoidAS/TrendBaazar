import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { useToast } from '../ToastContext/ToastContext';
import cartService from '../../services/cartService';
import { calculateCartTotals } from '../../utils/helpers';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscountPercent, setPromoDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await cartService.getCart(user?.id);
      setCartItems(items);
    } catch (err) {
      console.error('[Cart Context] Error loading cart:', err);
      setError(err.message || 'Failed to load shopping cart items.');
    } finally {
      setLoading(false);
    }
  };

  // Load cart when user session switches
  useEffect(() => {
    loadCart();
  }, [user]);

  // Sync cart items to local storage
  const syncCart = async (newItems) => {
    setCartItems(newItems);
    try {
      await cartService.saveCart(user?.id, newItems);
    } catch (err) {
      console.error('[Cart Context] Error syncing cart:', err);
    }
  };

  const addToCart = (product, quantity = 1, selectedColor = '', selectedSize = '') => {
    const itemsCopy = [...cartItems];

    // Find index of item matching product ID, color, and size
    const existingIndex = itemsCopy.findIndex(
      (item) =>
        item.id === product.id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      itemsCopy[existingIndex].quantity += quantity;
    } else {
      itemsCopy.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity,
        selectedColor: selectedColor || (product.colors ? product.colors[0] : ''),
        selectedSize: selectedSize || (product.sizes ? product.sizes[0] : ''),
      });
    }

    syncCart(itemsCopy);
    addToast(`${product.name} added to cart.`, 'cart');
  };

  const removeFromCart = (productId, selectedColor = '', selectedSize = '') => {
    const matchAny = !selectedColor && !selectedSize;
    const item = cartItems.find(
      (i) =>
        i.id === productId &&
        (matchAny || (i.selectedColor === selectedColor && i.selectedSize === selectedSize))
    );
    const name = item ? item.name : 'Item';
    const filteredItems = cartItems.filter(
      (item) =>
        !(
          item.id === productId &&
          (matchAny || (item.selectedColor === selectedColor && item.selectedSize === selectedSize))
        )
    );
    syncCart(filteredItems);
    addToast(`${name} removed from cart.`, 'cart-remove');
  };

  const updateQuantity = (productId, quantity, selectedColor = '', selectedSize = '') => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor, selectedSize);
      return;
    }

    const itemsCopy = cartItems.map((item) => {
      if (
        item.id === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
      ) {
        return { ...item, quantity };
      }
      return item;
    });

    syncCart(itemsCopy);
  };

  const clearCart = () => {
    syncCart([]);
    setPromoCode('');
    setPromoDiscountPercent(0);
  };

  const applyPromoCode = async (code) => {
    setPromoError(null);
    try {
      const promo = await cartService.validatePromoCode(code);
      setPromoCode(code.toUpperCase());
      setPromoDiscountPercent(promo.discountPercent);
      addToast(`Promo coupon "${code.toUpperCase()}" applied!`, 'success');
      return promo;
    } catch (err) {
      setPromoError(err.message);
      setPromoDiscountPercent(0);
      addToast(err.message || 'Failed to apply promo coupon.', 'error');
      throw err;
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoDiscountPercent(0);
    setPromoError(null);
  };

  // Compute pricing totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * (promoDiscountPercent / 100);
  const discountedSubtotal = subtotal - discount;
  const tax = discountedSubtotal * 0.18; // 18% GST representation
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 150; // Free shipping above ₹1500, else ₹150 shipping fee
  const total = discountedSubtotal + tax + shipping;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        promoCode,
        promoDiscountPercent,
        promoError,
        totals: {
          subtotal,
          discount,
          tax,
          shipping,
          total,
        },
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider');
  }
  return context;
};

export default CartContext;
