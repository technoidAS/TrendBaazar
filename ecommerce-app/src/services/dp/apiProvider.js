import axiosInstance from '../api/axiosInstance';
import endpoints from '../api/endpoints';

// Helper to map flat backend API order structure to nested frontend structure
const mapApiOrderToFrontend = (apiOrder) => {
  if (!apiOrder) return null;
  return {
    id: apiOrder.id,
    userId: apiOrder.userId,
    orderDate: apiOrder.orderDate,
    status: apiOrder.status,
    promoCodeApplied: apiOrder.promoCodeApplied || '',
    shippingDetails: {
      name: apiOrder.shippingName,
      phone: apiOrder.shippingPhone,
      address: apiOrder.shippingAddress
    },
    paymentDetails: {
      method: apiOrder.paymentMethod || 'Razorpay Sandbox',
      paymentId: apiOrder.paymentId || '',
      signature: apiOrder.signature || '',
      amountPaid: apiOrder.total || 0
    },
    totals: {
      subtotal: apiOrder.subtotal || 0,
      discount: apiOrder.discount || 0,
      shipping: apiOrder.shipping || 0,
      tax: apiOrder.tax || 0,
      total: apiOrder.total || 0
    },
    items: (apiOrder.items || []).map(item => ({
      id: item.id,
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize
    }))
  };
};

export const apiProvider = {
  // --- PRODUCTS DRIVER ---
  getProducts: async () => {
    const response = await axiosInstance.get(endpoints.PRODUCTS);
    return response.data;
  },

  getProductById: async (id) => {
    const response = await axiosInstance.get(`${endpoints.PRODUCTS}/${id}`);
    return response.data;
  },

  // --- AUTH DRIVER ---
  requestOtp: async (phone) => {
    const response = await axiosInstance.post(endpoints.OTP_REQUEST, { phone });
    return response.data;
  },

  verifyOtp: async (phone, otp) => {
    const response = await axiosInstance.post(endpoints.OTP_VERIFY, { phone, code: otp });
    return response.data; // Returns { token, user }
  },

  updateProfile: async (userId, updatedData) => {
    // Profile is updated securely via JWT identity — no userId needed in path
    const response = await axiosInstance.put(endpoints.PROFILE, updatedData);
    return response.data;
  },

  // --- CART DRIVER ---
  getCart: async (userId) => {
    // Load cart from backend DB — restores cart across devices/sessions
    const response = await axiosInstance.get(endpoints.CART);
    return response.data; // Returns array of cart items
  },

  saveCart: async (userId, items) => {
    // Save entire cart to backend DB on every change
    const response = await axiosInstance.put(endpoints.CART, items);
    return items; // Return original items for consistency with localProvider
  },

  // --- ORDERS DRIVER ---
  getOrders: async (userId) => {
    // Fetches the authenticated user's orders based on JWT token credentials
    const response = await axiosInstance.get(endpoints.ORDERS);
    return response.data.map(mapApiOrderToFrontend);
  },

  createOrder: async (orderData) => {
    // Map nested frontend structure to flat backend DTO structure
    const flatOrderPayload = {
      shippingName: orderData.shippingDetails?.name || '',
      shippingPhone: orderData.shippingDetails?.phone || '',
      shippingAddress: orderData.shippingDetails?.address || '',
      subtotal: orderData.totals?.subtotal || 0,
      discount: orderData.totals?.discount || 0,
      shipping: orderData.totals?.shipping || 0,
      tax: orderData.totals?.tax || 0,
      total: orderData.totals?.total || 0,
      promoCodeApplied: orderData.promoCodeApplied || '',
      paymentMethod: orderData.paymentDetails?.method || 'Razorpay Sandbox',
      paymentId: orderData.paymentDetails?.paymentId || '',
      signature: orderData.paymentDetails?.signature || '',
      items: (orderData.items || []).map(item => ({
        productId: item.productId || item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        quantity: item.quantity,
        selectedColor: item.selectedColor || '',
        selectedSize: item.selectedSize || ''
      }))
    };
    const response = await axiosInstance.post(endpoints.ORDERS, flatOrderPayload);
    // Also clear the persisted cart in the backend DB after order is placed
    try { await axiosInstance.delete(endpoints.CART); } catch (_) {}
    return mapApiOrderToFrontend(response.data);
  },

  // --- ADMIN DRIVER ---
  addProduct: async (productData) => {
    const response = await axiosInstance.post(endpoints.ADMIN_PRODUCTS, productData);
    return response.data;
  },

  deleteProduct: async (productId) => {
    const response = await axiosInstance.delete(`${endpoints.ADMIN_PRODUCTS}/${productId}`);
    return response.data;
  },

  getUsers: async () => {
    const response = await axiosInstance.get(endpoints.ADMIN_USERS);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await axiosInstance.get(endpoints.ADMIN_ORDERS);
    return response.data.map(mapApiOrderToFrontend);
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await axiosInstance.put(`${endpoints.ADMIN_ORDERS}/${orderId}`, { status });
    return response.data;
  }
};

export default apiProvider;
