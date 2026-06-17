import dp from './dp/dpSelector';

export const productService = {
  // Public paginated product feed
  getProducts: (params) => {
    return dp.getProducts(params);
  },

  // Sidebar categories (filtered by search if provided)
  getCategories: (search) => {
    return dp.getCategories(search);
  },

  // Single product page
  getProductById: (id) => {
    return dp.getProductById(id);
  },

  // Admin — create
  addProduct: (productData) => {
    return dp.addProduct(productData);
  },

  // Admin — update
  updateProduct: (productId, productData) => {
    return dp.updateProduct(productId, productData);
  },

  // Admin — delete
  deleteProduct: (id) => {
    return dp.deleteProduct(id);
  },

  // Submit or update a star rating (1-5) for a product
  rateProduct: (productId, rating) => {
    return dp.rateProduct(productId, rating);
  }
};

export default productService;
