import dp from './dp/dpSelector';

export const productService = {
  getProducts: () => {
    return dp.getProducts();
  },

  getProductById: (id) => {
    return dp.getProductById(id);
  },

  addProduct: (productData) => {
    return dp.addProduct(productData);
  },

  deleteProduct: (id) => {
    return dp.deleteProduct(id);
  },

  // Submit or update a star rating (1-5) for a product
  rateProduct: (productId, rating) => {
    return dp.rateProduct(productId, rating);
  }
};

export default productService;

