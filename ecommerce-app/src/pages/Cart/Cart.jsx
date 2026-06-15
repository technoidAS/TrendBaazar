import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, Tag, X } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import ErrorView from '../../components/common/Error/ErrorView';
import SlideUp from '../../components/animations/SlideUp';
import formatCurrency from '../../utils/formatCurrency';
import './Cart.css';

export function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    loading,
    error,
    totals,
    updateQuantity,
    removeFromCart,
    promoCode,
    promoError,
    applyPromoCode,
    removePromoCode,
    loadCart,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [applying, setApplying] = useState(false);

  if (error) {
    return (
      <div className="cart-page-error container flex justify-center align-center" style={{ minHeight: '50vh' }}>
        <ErrorView message={error} onRetry={loadCart} />
      </div>
    );
  }

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    setApplying(true);
    try {
      await applyPromoCode(promoInput);
      setPromoInput('');
    } catch (err) {
      console.warn('[Cart Page] Failed to apply coupon:', err);
    } finally {
      setApplying(false);
    }
  };

  const handleCheckoutClick = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-empty container glass-panel">
        <div className="empty-cart-circle">
          <ShoppingBag size={32} />
        </div>
        <h1 className="empty-title">Your Cart is Empty</h1>
        <p className="empty-subtitle" style={{ color: 'var(--text-secondary)', maxWidth: '380px', margin: '0 auto var(--space-sm) auto', lineHeight: 'var(--lh-normal)' }}>
          Looks like you haven't added any products to your cart yet. Check out our featured catalog.
        </p>
        <Button onClick={() => navigate('/shop')} variant="primary" size="lg">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="cart-page-container container text-left">
      <h1 className="cart-page-title">Shopping Cart</h1>
      
      <div className="cart-layout-grid">
        {/* Left Side: Items List */}
        <div className="cart-items-col">
          {cartItems.map((item, idx) => (
            <SlideUp key={`${item.id}_${item.selectedColor}_${item.selectedSize}`} delay={idx * 50}>
              <div className="cart-item-row glass-panel">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                
                <div className="cart-item-details">
                  <h3 className="cart-item-name">
                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                  </h3>
                  <div className="cart-item-options flex gap-sm">
                    {item.selectedColor && (
                      <span className="item-opt">
                        Color: <strong>{item.selectedColor}</strong>
                      </span>
                    )}
                    {item.selectedSize && (
                      <span className="item-opt">
                        Size: <strong>{item.selectedSize}</strong>
                      </span>
                    )}
                  </div>
                  <span className="cart-item-price-unit">{formatCurrency(item.price)}</span>
                </div>

                {/* Quantity Controls */}
                <div className="cart-item-qty flex align-center">
                  <button
                    className="qty-adjust-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qty-adjust-val">{item.quantity}</span>
                  <button
                    className="qty-adjust-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Subtotal & Delete actions */}
                <div className="cart-item-subtotal flex align-center gap-md">
                  <span className="item-sub-price">{formatCurrency(item.price * item.quantity)}</span>
                  <button
                    className="item-delete-btn"
                    onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </SlideUp>
          ))}
        </div>

        {/* Right Side: Order Summary */}
        <div className="cart-summary-col">
          <div className="summary-card glass-panel">
            <h3 className="summary-title">Order Summary</h3>
            <hr className="summary-divider" />

            <div className="summary-row flex justify-between">
              <span className="row-label">Subtotal</span>
              <span className="row-val">{formatCurrency(totals.subtotal)}</span>
            </div>

            {totals.discount > 0 && (
              <div className="summary-row flex justify-between discount-row">
                <span className="row-label">Promo Discount ({promoCode})</span>
                <span className="row-val">-{formatCurrency(totals.discount)}</span>
              </div>
            )}

            <div className="summary-row flex justify-between">
              <span className="row-label">Shipping</span>
              <span className="row-val">
                {totals.shipping === 0 ? 'Free Shipping' : formatCurrency(totals.shipping)}
              </span>
            </div>

            <div className="summary-row flex justify-between">
              <span className="row-label">Sales Tax (8%)</span>
              <span className="row-val">{formatCurrency(totals.tax)}</span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-row flex justify-between total-row">
              <span className="row-label">Total Amount</span>
              <span className="row-val text-brand">{formatCurrency(totals.total)}</span>
            </div>

            {/* Promo coupon form */}
            <form onSubmit={handleApplyPromo} className="summary-promo-form">
              {promoCode ? (
                <div className="applied-promo-badge flex justify-between align-center">
                  <div className="flex align-center gap-xs">
                    <Tag size={14} className="text-secondary" />
                    <span className="promo-text">Coupon Applied: <strong>{promoCode}</strong></span>
                  </div>
                  <button type="button" onClick={removePromoCode} className="remove-promo-btn" aria-label="Remove promo">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="promo-input-group flex gap-xs">
                  <Input
                    placeholder="Promo (e.g. WELCOME10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    error={promoError}
                    style={{ marginBottom: 0 }}
                  />
                  <Button type="submit" variant="outlined" loading={applying} className="promo-apply-btn">
                    Apply
                  </Button>
                </div>
              )}
            </form>

            <Button
              variant="primary"
              size="lg"
              className="checkout-proceed-btn"
              onClick={handleCheckoutClick}
              iconRight={<ArrowRight size={18} />}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
