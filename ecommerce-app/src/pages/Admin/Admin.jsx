import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import {
  ShoppingBag, Users, ClipboardList, ShieldAlert, Plus, Trash2,
  ChevronDown, Package, Tag, Image, Type, DollarSign, Hash,
  Palette, Ruler, AlignLeft, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext/AuthContext';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import authService from '../../services/authService';
import dp from '../../services/dp/dpSelector';
import Button from '../../components/common/Button/Button';
import FadeIn from '../../components/animations/FadeIn';
import formatCurrency from '../../utils/formatCurrency';
import { useToast } from '../../context/ToastContext/ToastContext';
import './Admin.css';

const PAGE_SIZE = 15;

export function Admin() {
  const { user } = useAuth();
  const isApiMode = import.meta.env.VITE_DATA_SOURCE === 'api';

  if (!user || user.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }

  const [activeTab, setActiveTab] = useState('products');

  // Products
  const [products, setProducts]         = useState([]);
  const [prodPage, setProdPage]         = useState(0);
  const [prodHasMore, setProdHasMore]   = useState(false);
  const [prodLoading, setProdLoading]   = useState(false);
  const allProductsRef                  = useRef([]);

  // Orders
  const [orders, setOrders]               = useState([]);
  const [orderPage, setOrderPage]         = useState(0);
  const [orderHasMore, setOrderHasMore]   = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const allOrdersRef                      = useRef([]);

  // Users
  const [users, setUsers]               = useState([]);
  const [userPage, setUserPage]         = useState(0);
  const [userHasMore, setUserHasMore]   = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const allUsersRef                     = useRef([]);

  // Dashboard
  const [dashboardStats, setDashboardStats] = useState(null);
  const [globalLoading, setGlobalLoading]   = useState(true);
  const [error, setError]                   = useState(null);

  const { addToast } = useToast();

  // Modal form state
  const [showAddModal, setShowAddModal]     = useState(false);
  const [newProd, setNewProd] = useState({
    name: '', price: '', category: 'apparel', brand: '',
    colors: '', sizes: '', image: '', desc: '', stock: '10'
  });
  const [formError, setFormError]   = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const updateProd = (key, val) => setNewProd(p => ({ ...p, [key]: val }));

  // ---- Slice helper ----
  const slicePage = (list, page) => list.slice(0, (page + 1) * PAGE_SIZE);

  // ---- Load all data ----
  useEffect(() => {
    (async () => {
      setGlobalLoading(true);
      setError(null);
      try {
        if (isApiMode && typeof dp.getAdminStats === 'function') {
          const stats = await dp.getAdminStats();
          setDashboardStats(stats);
        }

        const prodsRaw = await dp.getAdminProducts();
        const prodsArr = Array.isArray(prodsRaw) ? prodsRaw : [];
        allProductsRef.current = prodsArr;
        setProducts(slicePage(prodsArr, 0));
        setProdPage(0);
        setProdHasMore(prodsArr.length > PAGE_SIZE);

        const ordersData = await orderService.getAllOrders();
        const ordersArr  = Array.isArray(ordersData) ? ordersData : [];
        allOrdersRef.current = ordersArr;
        setOrders(slicePage(ordersArr, 0));
        setOrderPage(0);
        setOrderHasMore(ordersArr.length > PAGE_SIZE);

        const usersData = await authService.getUsers();
        const usersArr  = Array.isArray(usersData) ? usersData : [];
        allUsersRef.current = usersArr;
        setUsers(slicePage(usersArr, 0));
        setUserPage(0);
        setUserHasMore(usersArr.length > PAGE_SIZE);
      } catch (err) {
        console.error('[Admin] Load error:', err);
        setError('Failed to load dashboard data. Please refresh.');
      } finally {
        setGlobalLoading(false);
      }
    })();
  }, []);

  // ---- Window scroll infinite loading ----
  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 300;
      if (!nearBottom) return;

      if (activeTab === 'products' && prodHasMore && !prodLoading) {
        const next = prodPage + 1;
        setProdLoading(true);
        const slice = slicePage(allProductsRef.current, next);
        setProducts(slice);
        setProdPage(next);
        setProdHasMore(slice.length < allProductsRef.current.length);
        setProdLoading(false);
      }

      if (activeTab === 'orders' && orderHasMore && !ordersLoading) {
        const next = orderPage + 1;
        setOrdersLoading(true);
        const slice = slicePage(allOrdersRef.current, next);
        setOrders(slice);
        setOrderPage(next);
        setOrderHasMore(slice.length < allOrdersRef.current.length);
        setOrdersLoading(false);
      }

      if (activeTab === 'users' && userHasMore && !usersLoading) {
        const next = userPage + 1;
        setUsersLoading(true);
        const slice = slicePage(allUsersRef.current, next);
        setUsers(slice);
        setUserPage(next);
        setUserHasMore(slice.length < allUsersRef.current.length);
        setUsersLoading(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [
    activeTab,
    prodHasMore, prodLoading, prodPage,
    orderHasMore, ordersLoading, orderPage,
    userHasMore, usersLoading, userPage,
  ]);

  // ---- Manual Load More handlers ----
  const handleLoadMoreProds = () => {
    if (prodLoading || !prodHasMore) return;
    const next = prodPage + 1;
    setProdLoading(true);
    const slice = slicePage(allProductsRef.current, next);
    setProducts(slice);
    setProdPage(next);
    setProdHasMore(slice.length < allProductsRef.current.length);
    setProdLoading(false);
  };

  const handleLoadMoreOrders = () => {
    if (ordersLoading || !orderHasMore) return;
    const next = orderPage + 1;
    setOrdersLoading(true);
    const slice = slicePage(allOrdersRef.current, next);
    setOrders(slice);
    setOrderPage(next);
    setOrderHasMore(slice.length < allOrdersRef.current.length);
    setOrdersLoading(false);
  };

  const handleLoadMoreUsers = () => {
    if (usersLoading || !userHasMore) return;
    const next = userPage + 1;
    setUsersLoading(true);
    const slice = slicePage(allUsersRef.current, next);
    setUsers(slice);
    setUserPage(next);
    setUserHasMore(slice.length < allUsersRef.current.length);
    setUsersLoading(false);
  };

  // ---- Add Product ----
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!newProd.name || !newProd.price || !newProd.image) {
      setFormError('Product name, price, and image URL are required.');
      return;
    }
    const priceNum = parseFloat(newProd.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Enter a valid price greater than zero.');
      return;
    }
    setActionLoading(true);
    try {
      const result = await productService.addProduct({
        name: newProd.name,
        price: priceNum,
        category: newProd.category,
        brand: newProd.brand || 'TrendBaazar',
        image: newProd.image,
        description: newProd.desc || 'Premium e-commerce design edition.',
        stock: parseInt(newProd.stock) || 10,
        colors: newProd.colors ? newProd.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
        sizes: newProd.sizes ? newProd.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        features: []
      });
      const item = result || { id: Date.now().toString(), ...newProd, price: priceNum };
      allProductsRef.current = [item, ...allProductsRef.current];
      setProducts(prev => [item, ...prev]);
      closeModal();
      addToast(`"${item.name}" added to catalog!`, 'success');
    } catch (err) {
      setFormError('Failed to create product. Try again.');
      addToast('Failed to add product.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setFormError('');
    setNewProd({ name: '', price: '', category: 'apparel', brand: '', colors: '', sizes: '', image: '', desc: '', stock: '10' });
  };

  // ---- Delete Product ----
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productService.deleteProduct(productId);
      allProductsRef.current = allProductsRef.current.filter(p => p.id !== productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      addToast('Product deleted.', 'warning');
    } catch {
      addToast('Failed to delete product.', 'error');
    }
  };

  // ---- Update Order Status ----
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      allOrdersRef.current = allOrdersRef.current.map(o => o.id === orderId ? { ...o, status } : o);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      addToast(`Order → "${status}"`, 'info');
    } catch {
      addToast('Failed to update order status.', 'error');
    }
  };

  // ---- Stats ----
  const totalRevenue  = dashboardStats?.totalSales   ?? allOrdersRef.current.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (o.totals?.total || 0), 0);
  const ordersCount   = dashboardStats?.ordersCount  ?? allOrdersRef.current.length;
  const usersCount    = dashboardStats?.usersCount   ?? allUsersRef.current.length;
  const productsCount = dashboardStats?.productsCount ?? allProductsRef.current.length;

  if (globalLoading) {
    return (
      <div className="admin-loading container flex justify-center align-center" style={{ minHeight: '60vh' }}>
        <h3>Loading Admin Console…</h3>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container container text-left">

      {/* Header */}
      <div className="admin-header flex justify-between align-center">
        <div>
          <h1 className="admin-title flex align-center gap-sm">
            <ShieldAlert className="text-secondary" />
            <span>Admin Console Panel</span>
          </h1>
          <p className="admin-subtitle text-mut">
            Manage TrendBaazar catalog drops, user registries, and client order logs.
          </p>
        </div>
        <button className="admin-add-btn" onClick={() => setShowAddModal(true)}>
          <Plus size={17} strokeWidth={2.5} />
          <span>Add Product</span>
        </button>
      </div>

      {error && (
        <div className="auth-error-banner" style={{ marginBottom: 'var(--space-md)' }}>{error}</div>
      )}

      {/* Stats */}
      <div className="admin-stats-grid">
        {[
          { label: 'Total Revenue',        val: formatCurrency(totalRevenue),       icon: <ShoppingBag size={20}/>, cls: 'cyan-glow' },
          { label: 'Client Orders',         val: `${ordersCount} Logged`,            icon: <ClipboardList size={20}/>, cls: 'purple-glow' },
          { label: 'Registered Customers',  val: `${usersCount} Users`,              icon: <Users size={20}/>, cls: '' },
          { label: 'Product Listings',      val: `${productsCount} Items`,           icon: <ShoppingBag size={20}/>, cls: '' },
        ].map((s, i) => (
          <div key={i} className="admin-stat-card glass-panel">
            <div className="flex justify-between align-center">
              <span className="stat-label">{s.label}</span>
              <span className={`stat-icon-wrapper ${s.cls}`}>{s.icon}</span>
            </div>
            <h3 className={`stat-value ${i === 0 ? 'text-gradient-cyan' : ''}`}>{s.val}</h3>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="admin-tab-bar flex gap-md">
        {[['products','Manage Products'],['orders','Manage Orders'],['users','Customer Directory']].map(([id, label]) => (
          <button
            key={id}
            className={`admin-tab-btn ${activeTab === id ? 'active-tab' : ''}`}
            onClick={() => setActiveTab(id)}
          >{label}</button>
        ))}
      </div>
      <hr className="admin-divider" />

      {/* ── PRODUCTS TAB ── */}
      {activeTab === 'products' && (
        <FadeIn className="admin-table-wrapper glass-panel">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Details</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--text-muted)' }}>No products found.</td></tr>
              ) : products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="admin-table-item flex align-center gap-sm">
                      <img src={p.image} alt={p.name} className="admin-table-img" />
                      <div>
                        <p className="admin-item-name">{p.name}</p>
                        <span className="admin-item-id">{p.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-capitalize">{p.categoryName || p.category || '—'}</td>
                  <td><strong>{formatCurrency(p.price)}</strong></td>
                  <td>{p.stock ?? '—'} units</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="admin-action-btn delete-btn" onClick={() => handleDeleteProduct(p.id)} title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Load more footer */}
          {prodHasMore && (
            <div className="admin-load-more-row">
              <button className="admin-load-more-btn" onClick={handleLoadMoreProds} disabled={prodLoading}>
                {prodLoading ? 'Loading…' : `Load more (${allProductsRef.current.length - products.length} remaining)`}
                {!prodLoading && <ChevronDown size={15} />}
              </button>
            </div>
          )}
          {!prodHasMore && products.length > 0 && (
            <p className="admin-end-lbl">✓ All {allProductsRef.current.length} products loaded</p>
          )}
        </FadeIn>
      )}

      {/* ── ORDERS TAB ── */}
      {activeTab === 'orders' && (
        <FadeIn className="admin-table-wrapper glass-panel">
          {allOrdersRef.current.length === 0 ? (
            <p style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--text-muted)' }}>No order logs found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>
                      <span className="admin-item-id">{o.id}</span><br />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {new Date(o.orderDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <p className="admin-item-name">{o.shippingDetails?.name}</p>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{o.shippingDetails?.phone}</span>
                    </td>
                    <td>
                      <div className="flex flex-col gap-2xs">
                        {(o.items || []).map((item, idx) => (
                          <span key={idx} style={{ fontSize: '12px' }}>{item.name} ×{item.quantity}</span>
                        ))}
                      </div>
                    </td>
                    <td><strong>{formatCurrency(o.totals?.total)}</strong></td>
                    <td>
                      <div className={`admin-status-wrapper status-${(o.status||'').toLowerCase()}`}>
                        <select
                          value={o.status}
                          className={`admin-status-select select-${(o.status||'').toLowerCase()}`}
                          onChange={e => handleUpdateOrderStatus(o.id, e.target.value)}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <ChevronDown size={13} className="status-chevron" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {orderHasMore && (
            <div className="admin-load-more-row">
              <button className="admin-load-more-btn" onClick={handleLoadMoreOrders} disabled={ordersLoading}>
                {ordersLoading ? 'Loading…' : `Load more (${allOrdersRef.current.length - orders.length} remaining)`}
                {!ordersLoading && <ChevronDown size={15} />}
              </button>
            </div>
          )}
          {!orderHasMore && orders.length > 0 && (
            <p className="admin-end-lbl">✓ All {allOrdersRef.current.length} orders loaded</p>
          )}
        </FadeIn>
      )}

      {/* ── USERS TAB ── */}
      {activeTab === 'users' && (
        <FadeIn className="admin-table-wrapper glass-panel">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Primary Address</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--text-muted)' }}>No users registered.</td></tr>
              ) : users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="admin-table-item flex align-center gap-sm">
                      <img src={u.avatar} alt={u.name} className="admin-table-avatar" />
                      <div>
                        <p className="admin-item-name">{u.name}</p>
                        <span className="admin-item-id">{u.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone || 'N/A'}</td>
                  <td><span style={{ fontSize: '12px' }}>{u.addresses?.[0]?.address || 'N/A'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>

          {userHasMore && (
            <div className="admin-load-more-row">
              <button className="admin-load-more-btn" onClick={handleLoadMoreUsers} disabled={usersLoading}>
                {usersLoading ? 'Loading…' : `Load more (${allUsersRef.current.length - users.length} remaining)`}
                {!usersLoading && <ChevronDown size={15} />}
              </button>
            </div>
          )}
          {!userHasMore && users.length > 0 && (
            <p className="admin-end-lbl">✓ All {allUsersRef.current.length} users loaded</p>
          )}
        </FadeIn>
      )}

      {/* ══════════ ADD PRODUCT MODAL ══════════ */}
      {showAddModal && (
        <div className="admin-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <FadeIn className="admin-modal-card">
            {/* Modal header */}
            <div className="modal-header">
              <div className="modal-header-icon"><Package size={20} /></div>
              <div>
                <h3 className="modal-title">Add New Product</h3>
                <p className="modal-subtitle">Fill in the catalog details below</p>
              </div>
              <button className="modal-close-btn" onClick={closeModal}><X size={18} /></button>
            </div>

            {formError && (
              <div className="modal-error-banner">{formError}</div>
            )}

            <form onSubmit={handleAddProduct} className="modal-form">

              {/* Row: Name (full width) */}
              <div className="modal-field-full">
                <label className="modal-label">
                   Product Name <span className="required-star">*</span>
                </label>
                <input
                  className="modal-input"
                  placeholder="e.g. Stealth Vapor Street Hoodie"
                  value={newProd.name}
                  onChange={e => updateProd('name', e.target.value)}
                  required
                />
              </div>

              {/* Row: Price + Stock */}
              <div className="modal-fields-row">
                <div className="modal-field">
                  <label className="modal-label">
                     Price (₹) <span className="required-star">*</span>
                  </label>
                  <input
                    className="modal-input"
                    type="number"
                    placeholder="e.g. 5999"
                    value={newProd.price}
                    onChange={e => updateProd('price', e.target.value)}
                    min="1"
                    required
                  />
                </div>
                <div className="modal-field">
                  <label className="modal-label">
                     Stock
                  </label>
                  <input
                    className="modal-input"
                    type="number"
                    placeholder="10"
                    value={newProd.stock}
                    onChange={e => updateProd('stock', e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              {/* Row: Category + Brand */}
              <div className="modal-fields-row">
                <div className="modal-field">
                  <label className="modal-label">
                    <Tag size={13} /> Category
                  </label>
                  <div className="modal-select-wrapper">
                    <select
                      className="modal-select"
                      value={newProd.category}
                      onChange={e => updateProd('category', e.target.value)}
                    >
                      <option value="apparel">Premium Apparel</option>
                      <option value="footwear">Design Footwear</option>
                      <option value="gadgets">Sci-fi Gadgets</option>
                      <option value="accessories">Accessories</option>
                    </select>
                    <ChevronDown size={14} className="modal-select-chevron" />
                  </div>
                </div>
                <div className="modal-field">
                  <label className="modal-label">
                    <ShoppingBag size={13} /> Brand
                  </label>
                  <input
                    className="modal-input"
                    placeholder="e.g. NeoTech, AeroFlux"
                    value={newProd.brand}
                    onChange={e => updateProd('brand', e.target.value)}
                  />
                </div>
              </div>

              {/* Row: Image URL */}
              <div className="modal-field-full">
                <label className="modal-label">
                  <Image size={13} /> Display Image URL <span className="required-star">*</span>
                </label>
                <input
                  className="modal-input"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newProd.image}
                  onChange={e => updateProd('image', e.target.value)}
                  required
                />
              </div>

              {/* Row: Colors + Sizes */}
              <div className="modal-fields-row">
                <div className="modal-field">
                  <label className="modal-label">
                    <Palette size={13} /> Colors <span className="modal-hint">(comma-separated)</span>
                  </label>
                  <input
                    className="modal-input"
                    placeholder="Carbon Black, Neon Teal"
                    value={newProd.colors}
                    onChange={e => updateProd('colors', e.target.value)}
                  />
                </div>
                <div className="modal-field">
                  <label className="modal-label">
                    <Ruler size={13} /> Sizes <span className="modal-hint">(comma-separated)</span>
                  </label>
                  <input
                    className="modal-input"
                    placeholder="S, M, L, XL"
                    value={newProd.sizes}
                    onChange={e => updateProd('sizes', e.target.value)}
                  />
                </div>
              </div>

              {/* Row: Description */}
              <div className="modal-field-full">
                <label className="modal-label">
                  <AlignLeft size={13} /> Description
                </label>
                <textarea
                  className="modal-input modal-textarea"
                  placeholder="Describe the product in a few words…"
                  value={newProd.desc}
                  onChange={e => updateProd('desc', e.target.value)}
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn" disabled={actionLoading}>
                  {actionLoading ? (
                    <><span className="modal-spinner" /> Adding…</>
                  ) : (
                    <><Plus size={16} /> Add to Catalog</>
                  )}
                </button>
              </div>
            </form>
          </FadeIn>
        </div>
      )}
    </div>
  );
}

export default Admin;
