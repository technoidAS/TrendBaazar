import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ShoppingBag, Users, ClipboardList, ShieldAlert, Plus, Trash2, Edit, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext/AuthContext';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import authService from '../../services/authService';
import dp from '../../services/dp/dpSelector';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import FadeIn from '../../components/animations/FadeIn';
import formatCurrency from '../../utils/formatCurrency';
import { useToast } from '../../context/ToastContext/ToastContext';
import './Admin.css';

export function Admin() {
  const { user } = useAuth();
  const isApiMode = import.meta.env.VITE_DATA_SOURCE === 'api';

  if (!user || user.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'users' | 'orders'
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const { addToast } = useToast();

  // Form state for adding product
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('apparel');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdStock, setNewProdStock] = useState('10');
  const [formError, setFormError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isApiMode && typeof dp.getAdminStats === 'function') {
        const stats = await dp.getAdminStats();
        setDashboardStats(stats);
      } else {
        setDashboardStats(null);
      }

      const prodsData = await productService.getProducts();
      setProducts(prodsData);
      
      const usersData = await authService.getUsers();
      setUsers(usersData);

      const ordersData = await orderService.getAllOrders();
      setOrders(ordersData);
    } catch (err) {
      console.error('[Admin Dashboard] Loading error:', err);
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!newProdName || !newProdPrice || !newProdImage) {
      setFormError('Please enter a product name, price, and image URL.');
      return;
    }
    const priceNum = parseFloat(newProdPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Please enter a valid price greater than zero.');
      return;
    }

    setActionLoading(true);
    try {
      const result = await productService.addProduct({
        name: newProdName,
        price: priceNum,
        category: newProdCategory,
        image: newProdImage,
        description: newProdDesc || 'Premium e-commerce design edition.',
        stock: parseInt(newProdStock) || 10
      });
      // Prepend local product state
      setProducts(prev => [result, ...prev]);
      setShowAddModal(false);
      // Reset form
      setNewProdName('');
      setNewProdPrice('');
      setNewProdCategory('apparel');
      setNewProdImage('');
      setNewProdDesc('');
      setNewProdStock('10');
      addToast(`Product "${result.name}" added successfully!`, 'success');
    } catch (err) {
      setFormError('Failed to create new product.');
      addToast('Failed to add new product.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      addToast('Product listing deleted successfully.', 'warning');
    } catch (err) {
      addToast('Failed to delete product.', 'error');
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      addToast(`Order status updated to "${status}".`, 'info');
    } catch (err) {
      addToast('Failed to update order status.', 'error');
    }
  };

  // Dashboard Stats Calculations
  const totalRevenue = dashboardStats?.totalSales ?? orders.reduce((sum, o) => {
    if (o.status !== 'Cancelled') return sum + o.totals.total;
    return sum;
  }, 0);
  const ordersCount = dashboardStats?.ordersCount ?? orders.length;
  const usersCount = dashboardStats?.usersCount ?? users.length;
  const productsCount = dashboardStats?.productsCount ?? products.length;

  if (loading) {
    return (
      <div className="admin-loading container flex justify-center align-center" style={{ minHeight: '60vh' }}>
        <h3>Loading Admin Panel dashboard...</h3>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container container text-left">
      <div className="admin-header flex justify-between align-center">
        <div>
          <h1 className="admin-title flex align-center gap-sm">
            <ShieldAlert className="text-secondary" />
            <span>Admin Console Panel</span>
          </h1>
          <p className="admin-subtitle text-mut">Manage TrendBaazar catalog drops, user registries, and client order logs.</p>
        </div>
        <Button variant="primary" iconLeft={<Plus size={18} />} onClick={() => setShowAddModal(true)}>
          Add New Product
        </Button>
      </div>

      {/* Stats row */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card glass-panel">
          <div className="flex justify-between align-center">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-icon-wrapper cyan-glow"><ShoppingBag size={20} /></span>
          </div>
          <h3 className="stat-value text-gradient-cyan">{formatCurrency(totalRevenue)}</h3>
        </div>
        <div className="admin-stat-card glass-panel">
          <div className="flex justify-between align-center">
            <span className="stat-label">Client Orders</span>
            <span className="stat-icon-wrapper purple-glow"><ClipboardList size={20} /></span>
          </div>
          <h3 className="stat-value">{ordersCount} Logged</h3>
        </div>
        <div className="admin-stat-card glass-panel">
          <div className="flex justify-between align-center">
            <span className="stat-label">Registered Customers</span>
            <span className="stat-icon-wrapper"><Users size={20} /></span>
          </div>
          <h3 className="stat-value">{usersCount} Users</h3>
        </div>
        <div className="admin-stat-card glass-panel">
          <div className="flex justify-between align-center">
            <span className="stat-label">Product Listings</span>
            <span className="stat-icon-wrapper"><ShoppingBag size={20} /></span>
          </div>
          <h3 className="stat-value">{productsCount} Items</h3>
        </div>
      </div>

      {/* Tab controls */}
      <div className="admin-tab-bar flex gap-md">
        <button className={`admin-tab-btn ${activeTab === 'products' ? 'active-tab' : ''}`} onClick={() => setActiveTab('products')}>
          Manage Products
        </button>
        <button className={`admin-tab-btn ${activeTab === 'orders' ? 'active-tab' : ''}`} onClick={() => setActiveTab('orders')}>
          Manage Orders
        </button>
        <button className={`admin-tab-btn ${activeTab === 'users' ? 'active-tab' : ''}`} onClick={() => setActiveTab('users')}>
          Customer Directory
        </button>
      </div>

      <hr className="admin-divider" />

      {/* Tab views */}
      <div className="admin-tab-content">
        
        {/* PRODUCTS TAB */}
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
                {products.map((p) => (
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
                    <td className="text-capitalize">{p.category}</td>
                    <td><strong>{formatCurrency(p.price)}</strong></td>
                    <td>{p.stock} units</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="admin-action-btn delete-btn" onClick={() => handleDeleteProduct(p.id)} title="Delete Product">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FadeIn>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <FadeIn className="admin-table-wrapper glass-panel">
            {orders.length === 0 ? (
              <p className="no-records-lbl" style={{ padding: 'var(--space-xl)' }}>No order logs found in database.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order Ref</th>
                    <th>Customer Details</th>
                    <th>Ordered Items</th>
                    <th>Total Price</th>
                    <th>Payment/Shipping Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <span className="admin-item-id">{o.id}</span>
                        <br />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {new Date(o.orderDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <p className="admin-item-name">{o.shippingDetails.name}</p>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{o.shippingDetails.phone}</span>
                      </td>
                      <td>
                        <div className="flex flex-col gap-2xs">
                          {o.items.map((item, idx) => (
                            <span key={idx} style={{ fontSize: '12px' }}>
                              {item.name} (x{item.quantity})
                            </span>
                          ))}
                        </div>
                      </td>
                      <td><strong>{formatCurrency(o.totals.total)}</strong></td>
                      <td>
                        <select
                          value={o.status}
                          className={`admin-status-select select-${o.status.toLowerCase()}`}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </FadeIn>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <FadeIn className="admin-table-wrapper glass-panel">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Contact info</th>
                  <th>Registered Phone</th>
                  <th>Primary Address</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
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
                    <td><span style={{ fontSize: '12px' }}>{u.address || 'N/A'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FadeIn>
        )}

      </div>

      {/* Modal for adding product */}
      {showAddModal && (
        <div className="admin-modal-backdrop flex justify-center align-center">
          <FadeIn className="admin-modal-card glass-panel text-left">
            <h3 className="modal-title">Add New Catalog Product</h3>
            <hr className="step-divider" />
            
            {formError && <div className="auth-error-banner" style={{ marginBottom: 'var(--space-md)' }}>{formError}</div>}
            
            <form onSubmit={handleAddProduct} className="checkout-fields-stack">
              <Input
                label="Product Name"
                placeholder="e.g. Stealth Vapor Street Hoodie"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                required
              />
              <div className="input-fields-row flex gap-md">
                <Input
                  label="Price (INR)"
                  placeholder="e.g. 5999"
                  type="number"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  required
                />
                <Input
                  label="Available Stock"
                  placeholder="10"
                  type="number"
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(e.target.value)}
                  required
                />
              </div>
              <div className="options-section" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xs)' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--weight-semibold)' }}>Category</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  style={{
                    padding: '0.65rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                >
                  <option value="apparel">Premium Apparel</option>
                  <option value="footwear">Design Footwear</option>
                  <option value="gadgets">Sci-fi Gadgets</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <Input
                label="Display Image URL"
                placeholder="e.g. https://images.unsplash.com/photo-..."
                value={newProdImage}
                onChange={(e) => setNewProdImage(e.target.value)}
                required
              />
              <Input
                label="Product Description"
                placeholder="e.g. Cyberpunk techwear hoodie designed for comfort."
                value={newProdDesc}
                onChange={(e) => setNewProdDesc(e.target.value)}
              />

              <div className="step-actions flex gap-md" style={{ marginTop: 'var(--space-md)' }}>
                <Button type="button" variant="outlined" onClick={() => setShowAddModal(false)} style={{ flex: 1 }}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={actionLoading} style={{ flex: 1.5 }}>
                  Add Product
                </Button>
              </div>
            </form>
          </FadeIn>
        </div>
      )}
    </div>
  );
}

export default Admin;
