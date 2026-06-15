import dp from './dp/dpSelector';

export const orderService = {
  getOrders: (userId) => {
    return dp.getOrders(userId);
  },
  
  createOrder: (orderData) => {
    return dp.createOrder(orderData);
  },

  getAllOrders: () => {
    return dp.getAllOrders();
  },

  updateOrderStatus: (orderId, status) => {
    return dp.updateOrderStatus(orderId, status);
  }
};

export default orderService;
