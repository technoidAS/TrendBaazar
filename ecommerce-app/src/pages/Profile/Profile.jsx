import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, User, Check, Package, Calendar, Tag, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext/AuthContext';
import orderService from '../../services/orderService';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Loader from '../../components/common/Loader/Loader';
import ErrorView from '../../components/common/Error/ErrorView';
import SlideUp from '../../components/animations/SlideUp';
import FadeIn from '../../components/animations/FadeIn';
import formatCurrency from '../../utils/formatCurrency';
import { formatDate } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext/ToastContext';
import './Profile.css';

const getStatusClass = (status) => {
  switch (status) {
    case 'Processing':
      return 'badge-warning';
    case 'Shipped':
      return 'badge-primary';
    case 'Delivered':
      return 'badge-success';
    case 'Cancelled':
      return 'badge-error';
    default:
      return 'badge-primary';
  }
};

export function Profile() {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Edit fields
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.addresses?.[0]?.address || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [email, setEmail] = useState(user?.email || '');
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [ordersError, setOrdersError] = useState(null);

  const fetchOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    setOrdersError(null);
    try {
      const data = await orderService.getOrders(user.id);
      setOrders(data);
    } catch (err) {
      console.error('[Profile Page] Failed to fetch orders:', err);
      setOrdersError(err.message || 'Failed to load order history.');
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMsg('');
    try {
      const updatedAddresses = [...(user.addresses || [])];
      if (updatedAddresses.length > 0) {
        updatedAddresses[0] = {
          ...updatedAddresses[0],
          address,
          name: name || user.name,
          phone: phone || user.phone
        };
      } else {
        updatedAddresses.push({
          id: 'addr_' + Date.now(),
          name: name || user.name,
          phone: phone || user.phone,
          address
        });
      }
      await updateProfile({ name, avatar, email, addresses: updatedAddresses });
      setIsEditing(false);
      addToast('Profile details updated successfully!', 'success');
    } catch (err) {
      console.error('[Profile Page] Failed to update details:', err);
      addToast(err.message || 'Failed to update details.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="profile-page-container container text-left">
      <h1 className="profile-page-title">My Account</h1>

      {successMsg && (
        <div className="profile-success-banner flex align-center gap-xs anim-slide-down">
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="profile-layout-grid">

        {/* Left Side: Profile Details and Edits */}
        <div className="profile-card-col">
          <div className="profile-details-card glass-panel">
            <div className="profile-card-header flex align-center gap-md">
              <div className="profile-avatar-large">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>
                    {user.name
                      ? user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                      : 'U'}
                  </span>
                )}
              </div>
              <div>
                <h3 className="profile-name-large">{user.name}</h3>
                <span className={`profile-role-badge flex align-center gap-2xs ${user.role === 'admin' ? 'role-admin' : ''}`}>
                  <UserCheck size={12} />
                  <span>{user.role === 'admin' ? 'Store Administrator' : 'Customer Member'}</span>
                </span>
              </div>
            </div>

            <hr className="profile-divider" />

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="profile-edit-form flex flex-col gap-md">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  iconLeft={<User size={18} />}
                  required
                />
                <Input
                  label="Phone Number (Registered)"
                  value={phone}
                  disabled
                  iconLeft={<Phone size={18} />}
                />
                <Input
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  iconLeft={<Mail size={18} />}
                  type="email"
                />
                <Input
                  label="Profile Image URL"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  iconLeft={<User size={18} />}
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                />
                <Input
                  label="Shipping Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  iconLeft={<MapPin size={18} />}
                />

                <div className="profile-edit-actions flex gap-sm justify-between">
                  <Button variant="outlined" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" loading={updating}>
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="profile-static-info flex flex-col gap-md">
                <div className="info-row flex align-center gap-sm">
                  <Mail size={18} className="text-muted" />
                  <div>
                    <span className="info-label">Email Address</span>
                    <span className="info-val">{user.email}</span>
                  </div>
                </div>

                <div className="info-row flex align-center gap-sm">
                  <Phone size={18} className="text-muted" />
                  <div>
                    <span className="info-label">Phone Number</span>
                    <span className="info-val">{user.phone || 'Not provided'}</span>
                  </div>
                </div>

                <div className="info-row flex align-center gap-sm">
                  <MapPin size={18} className="text-muted" />
                  <div>
                    <span className="info-label">Default Shipping Address</span>
                    <span className="info-val">{user.addresses?.[0]?.address || 'Not provided'}</span>
                  </div>
                </div>

                <Button variant="outlined" onClick={() => setIsEditing(true)} style={{ marginTop: 'var(--space-sm)' }}>
                  Edit Profile Information
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order History */}
        <div className="profile-orders-col">
          <div className="orders-header flex align-center gap-xs">
            <Package className="text-secondary" />
            <h2 className="orders-section-title">Order History</h2>
          </div>

          {loadingOrders ? (
            <Loader type="spinner" size="md" />
          ) : ordersError ? (
            <ErrorView message={ordersError} onRetry={fetchOrders} />
          ) : orders.length === 0 ? (
            <div className="orders-empty-state glass-panel flex flex-col justify-center align-center">
              <Package size={36} className="text-muted" />
              <h3>No orders found</h3>
              <p>Place your first secure checkout order today!</p>
            </div>
          ) : (
            <div className="orders-history-list flex flex-col gap-md">
              {orders.map((order, idx) => (
                <SlideUp key={order.id} delay={idx * 50}>
                  <div className="order-item-card glass-panel">

                    {/* Order header row */}
                    <div className="order-item-header flex justify-between align-center flex-wrap gap-sm">
                      <div className="flex align-center gap-md">
                        <div>
                          <span className="order-meta-lbl">Order Reference</span>
                          <span className="order-meta-val">{order.id}</span>
                        </div>
                        <div className="divider-line"></div>
                        <div>
                          <span className="order-meta-lbl">Date Placed</span>
                          <span className="order-meta-val flex align-center gap-2xs">
                            <Calendar size={12} />
                            {formatDate(order.orderDate)}
                          </span>
                        </div>
                      </div>

                      <div className="flex align-center gap-md">
                        <div>
                          <span className="order-meta-lbl">Total Charged</span>
                          <span className="order-meta-val text-brand font-bold">
                            {formatCurrency(order.totals.total)}
                          </span>
                        </div>
                        <span className={`order-status-badge badge ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <hr className="profile-divider" />

                    {/* Order items grid list */}
                    <div className="order-item-products">
                      {order.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="order-prod-row flex align-center justify-between">
                          <div className="flex align-center gap-sm">
                            <img src={item.image} alt={item.name} className="order-prod-img" />
                            <div className="order-prod-details">
                              <h4 className="order-prod-name">{item.name}</h4>
                              <span className="order-prod-meta">
                                Qty: {item.quantity} | Color: {item.selectedColor} | Size: {item.selectedSize}
                              </span>
                            </div>
                          </div>
                          <span className="order-prod-price">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </SlideUp>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;
