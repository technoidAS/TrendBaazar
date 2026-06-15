import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle2, ChevronRight, ArrowLeft, ClipboardList } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../context/AuthContext/AuthContext';
import orderService from '../../services/orderService';
import { validateRequired } from '../../utils/validators';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import FadeIn from '../../components/animations/FadeIn';
import formatCurrency from '../../utils/formatCurrency';
import { useToast } from '../../context/ToastContext/ToastContext';
import './Checkout.css';

// Helper to load Razorpay checkout script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totals, clearCart, promoCode } = useCart();
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Step 1: Shipping states (multiple address selection)
  const userAddresses = user?.addresses || (user?.address ? [
    { id: 'addr_default', name: user?.name || 'Default Recipient', phone: user?.phone || '', address: user?.address || '' }
  ] : []);

  const [selectedAddressId, setSelectedAddressId] = useState(userAddresses[0]?.id || 'new');
  const [name, setName] = useState(userAddresses[0]?.name || '');
  const [address, setAddress] = useState(userAddresses[0]?.address || '');
  const [phone, setPhone] = useState(userAddresses[0]?.phone || '');
  
  const [shippingErrors, setShippingErrors] = useState({});
  const [paymentErrors, setPaymentErrors] = useState({});

  const handleAddressSelect = (addrId) => {
    setSelectedAddressId(addrId);
    if (addrId === 'new') {
      setName('');
      setAddress('');
      setPhone('');
    } else {
      const selected = userAddresses.find(a => a.id === addrId);
      if (selected) {
        setName(selected.name);
        setAddress(selected.address);
        setPhone(selected.phone);
      }
    }
  };

  const validateShipping = () => {
    const err = {};
    const nameErr = validateRequired(name, 'Full name');
    if (nameErr) err.name = nameErr;
    
    const addrErr = validateRequired(address, 'Address');
    if (addrErr) err.address = addrErr;
    
    const phoneErr = validateRequired(phone, 'Phone number');
    if (phoneErr) err.phone = phoneErr;

    setShippingErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = validateShipping();
      if (!isValid) return;

      // Save a new address in the local storage profile if specified
      if (selectedAddressId === 'new' && user) {
        try {
          const newAddressObj = {
            id: 'addr_' + Date.now(),
            name,
            phone,
            address
          };
          const updatedAddresses = [...userAddresses, newAddressObj];
          await updateProfile({ addresses: updatedAddresses });
          setSelectedAddressId(newAddressObj.id);
          addToast('New address saved to your profile!', 'success');
        } catch (err) {
          console.error('[Checkout Page] Error saving address:', err);
        }
      }
      setStep(2);
    }
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    setPaymentErrors({});

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setPaymentErrors({ gateway: 'Failed to load Razorpay SDK. Please check your internet connection.' });
      setLoading(false);
      return;
    }

    // Amount is already in INR, convert to paisa (multiply by 100)
    const inrAmount = Math.round(totals.total * 100);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY, // Public key only — NEVER put secret key here
      amount: inrAmount,
      currency: 'INR',
      name: 'TrendBaazar E-Commerce',
      description: 'Simulated Order Checkout Sandbox',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=120&auto=format&fit=crop&q=80',
      handler: async function (response) {
        try {
          const orderPayload = {
            userId: user?.id || 'usr_guest',
            shippingDetails: { name, address, phone },
            items: cartItems,
            promoCodeApplied: promoCode,
            paymentDetails: {
              method: 'Razorpay Sandbox',
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature || 'simulated_sig_123',
              amountPaid: totals.total,
            },
            totals: {
              subtotal: totals.subtotal,
              discount: totals.discount,
              shipping: totals.shipping,
              tax: totals.tax,
              total: totals.total,
            },
          };

          const order = await orderService.createOrder(orderPayload);
          setCreatedOrder(order);
          clearCart();
          addToast('Payment successful! Your order has been placed.', 'success');
          setStep(3);
        } catch (err) {
          console.error('[Checkout Razorpay] Failed to create order after payment:', err);
          setPaymentErrors({ gateway: 'Payment succeeded, but order logging failed. Please contact support.' });
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: name,
        contact: phone,
        email: user?.email || `${phone.replace(/\D/g, '') || 'user'}@trendbaazar.com`
      },
      theme: {
        color: '#a855f7' // Purple theme matching TrendBaazar style
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('[Checkout Razorpay] Error launching checkout modal:', err);
      setPaymentErrors({ gateway: 'Error launching Razorpay gateway. Try again.' });
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="checkout-empty container flex flex-col justify-center align-center">
        <h3>Your cart is empty. Cannot checkout.</h3>
        <Button variant="primary" onClick={() => navigate('/shop')} style={{ marginTop: 'var(--space-md)' }}>
          Browse Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="checkout-page-container container text-left">
      <h1 className="checkout-page-title">Checkout Process</h1>

      {/* Checkout HUD steps indicators */}
      <div className="checkout-hud-steps flex align-center justify-center gap-md">
        <div className={`hud-step flex align-center gap-xs ${step >= 1 ? 'hud-step-active' : ''}`}>
          <span className="hud-step-num">1</span>
          <span className="hud-step-label">Shipping</span>
        </div>
        <ChevronRight size={14} className="text-muted" />
        <div className={`hud-step flex align-center gap-xs ${step >= 2 ? 'hud-step-active' : ''}`}>
          <span className="hud-step-num">2</span>
          <span className="hud-step-label">Payment</span>
        </div>
        <ChevronRight size={14} className="text-muted" />
        <div className={`hud-step flex align-center gap-xs ${step >= 3 ? 'hud-step-active' : ''}`}>
          <span className="hud-step-num">3</span>
          <span className="hud-step-label">Confirmation</span>
        </div>
      </div>

      <div className="checkout-layout-grid">
        
        {/* Left Side: Step Forms */}
        <div className="checkout-form-col">
          {step === 1 && (
            <FadeIn className="step-card glass-panel">
              <div className="step-card-header flex align-center gap-sm">
                <Truck className="text-brand" />
                <h3 className="step-card-title">Shipping Address</h3>
              </div>
              <hr className="step-divider" />
              
              <div className="checkout-addresses-selector flex flex-col gap-sm" style={{ marginBottom: 'var(--space-md)' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
                  Select Shipping Destination
                </label>
                
                <div className="addresses-list-grid flex flex-col gap-xs">
                  {userAddresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`address-radio-card glass-panel flex align-start gap-sm ${selectedAddressId === addr.id ? 'active-address-card' : ''}`}
                      style={{
                        padding: 'var(--space-sm) var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        border: selectedAddressId === addr.id ? '1px solid var(--primary)' : '1px solid var(--border-primary)',
                        background: selectedAddressId === addr.id ? 'rgba(168, 85, 247, 0.03)' : 'var(--bg-tertiary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <input
                        type="radio"
                        name="shipping_address_id"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => handleAddressSelect(addr.id)}
                        style={{ marginTop: '4px' }}
                      />
                      <div className="address-card-info text-left" style={{ fontSize: '13px' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{addr.name}</strong>
                        <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>{addr.phone}</span>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>{addr.address}</p>
                      </div>
                    </label>
                  ))}
                  
                  <label
                    className={`address-radio-card glass-panel flex align-center gap-sm ${selectedAddressId === 'new' ? 'active-address-card' : ''}`}
                    style={{
                      padding: 'var(--space-sm) var(--space-md)',
                      borderRadius: 'var(--radius-md)',
                      border: selectedAddressId === 'new' ? '1px solid var(--primary)' : '1px solid var(--border-primary)',
                      background: selectedAddressId === 'new' ? 'rgba(168, 85, 247, 0.03)' : 'var(--bg-tertiary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <input
                      type="radio"
                      name="shipping_address_id"
                      value="new"
                      checked={selectedAddressId === 'new'}
                      onChange={() => handleAddressSelect('new')}
                      style={{ marginRight: '6px' }}
                    />
                    <div className="address-card-info text-left" style={{ fontSize: '13px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>+ Add a different shipping address</strong>
                    </div>
                  </label>
                </div>
              </div>

              {selectedAddressId === 'new' && (
                <FadeIn className="checkout-fields-stack">
                  <Input
                    label="Recipient Full Name"
                    placeholder="Alex Trendsetter"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={shippingErrors.name}
                    required
                  />
                  <Input
                    label="Shipping Street Address"
                    placeholder="142 Cyberpunk Ave, Floor 12, Neo City"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    error={shippingErrors.address}
                    required
                  />
                  <Input
                    label="Contact Phone"
                    placeholder="+1 (555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={shippingErrors.phone}
                    required
                  />
                </FadeIn>
              )}

              <div className="step-actions flex justify-between align-center" style={{ marginTop: 'var(--space-md)' }}>
                <Button variant="ghost" onClick={() => navigate('/cart')} iconLeft={<ArrowLeft size={16} />}>
                  Back to Cart
                </Button>
                <Button variant="primary" onClick={handleNextStep} iconRight={<ChevronRight size={16} />}>
                  Next: Payment
                </Button>
              </div>
            </FadeIn>
          )}

          {step === 2 && (
            <FadeIn className="step-card glass-panel">
              <div className="step-card-header flex align-center gap-sm">
                <CreditCard className="text-brand" />
                <h3 className="step-card-title">Razorpay Sandbox Gateway</h3>
              </div>
              <hr className="step-divider" />
              
              <div className="razorpay-gateway-box text-center flex flex-col align-center gap-md" style={{ padding: 'var(--space-md) 0' }}>
                <div className="gateway-badge" style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  color: 'var(--primary)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--weight-semibold)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)'
                }}>
                  <span>Simulated Sandboxed Gateway Mode</span>
                </div>
                
                <div className="gateway-details glass-card text-left" style={{
                  width: '100%',
                  padding: 'var(--space-md)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                  fontSize: 'var(--font-size-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-xs)'
                }}>
                  <p><strong>Customer Name:</strong> {name}</p>
                  <p><strong>Shipping Contact:</strong> {phone}</p>
                  <p><strong>Billing Address:</strong> {address}</p>
                  <p><strong>Order Total:</strong> {formatCurrency(totals.total)}</p>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Pressing the button below will open the official Razorpay Checkout modal in test mode. You can verify card, netbanking, or UPI payments with sandbox responses.
                </p>

                {paymentErrors.gateway && (
                  <div className="auth-error-banner" style={{ width: '100%' }}>
                    <span>{paymentErrors.gateway}</span>
                  </div>
                )}

                <div className="step-actions flex justify-between align-center" style={{ width: '100%', marginTop: 'var(--space-sm)' }}>
                  <Button variant="ghost" onClick={() => setStep(1)} iconLeft={<ArrowLeft size={16} />}>
                    Back to Shipping
                  </Button>
                  <Button type="button" variant="secondary" loading={loading} onClick={handleRazorpayPayment}>
                    Pay via Razorpay
                  </Button>
                </div>
              </div>
            </FadeIn>
          )}

          {step === 3 && createdOrder && (
            <FadeIn className="step-card glass-panel checkout-success-card text-center">
              <CheckCircle2 size={54} className="text-success anim-pulse" />
              <h2 className="success-main-title">Thank You For Your Order!</h2>
              <p className="success-subtitle text-mut">
                Your order has been logged successfully. We sent a shipping tracking number to your profile inbox.
              </p>
              
              <div className="success-order-details glass-card text-left">
                <p>Order Reference: <strong>{createdOrder.id}</strong></p>
                {createdOrder.paymentDetails && (
                  <p>Payment Reference: <strong style={{ color: 'var(--secondary)' }}>{createdOrder.paymentDetails.paymentId}</strong></p>
                )}
                <p>Shipping Address: <span className="text-sec">{createdOrder.shippingDetails.address}</span></p>
                <p>Total Charge: <span className="text-brand font-bold">{formatCurrency(createdOrder.totals.total)}</span></p>
              </div>

              <div className="flex gap-md justify-center">
                <Button variant="outlined" onClick={() => navigate('/profile')}>
                  View Order History
                </Button>
                <Button variant="primary" onClick={() => navigate('/')}>
                  Return to Home
                </Button>
              </div>
            </FadeIn>
          )}
        </div>

        {/* Right Side: Order Summary Panel (Hidden on Step 3) */}
        {step !== 3 && (
          <div className="checkout-summary-col">
            <div className="checkout-summary-card glass-panel">
              <div className="summary-header flex align-center gap-xs">
                <ClipboardList size={18} className="text-secondary" />
                <h3 className="summary-title">Summary Review</h3>
              </div>
              <hr className="summary-divider" />

              <div className="checkout-items-list">
                {cartItems.map((item) => (
                  <div key={`${item.id}_${item.selectedColor}_${item.selectedSize}`} className="checkout-item flex align-center gap-sm">
                    <img src={item.image} alt={item.name} className="checkout-item-img" />
                    <div className="checkout-item-details text-left flex-grow">
                      <h4 className="checkout-item-name">{item.name}</h4>
                      <span className="checkout-item-subtext">Qty: {item.quantity} | Size: {item.selectedSize}</span>
                    </div>
                    <span className="checkout-item-price">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <hr className="summary-divider" />
              
              <div className="summary-row flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="summary-row flex justify-between discount-row">
                  <span>Promo Coupon Discount</span>
                  <span>-{formatCurrency(totals.discount)}</span>
                </div>
              )}
              <div className="summary-row flex justify-between">
                <span>Shipping</span>
                <span>{totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}</span>
              </div>
              <div className="summary-row flex justify-between">
                <span>Tax (8%)</span>
                <span>{formatCurrency(totals.tax)}</span>
              </div>
              <hr className="summary-divider" />
              <div className="summary-row flex justify-between total-row">
                <span>Order Total</span>
                <span className="text-brand">{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Checkout;
