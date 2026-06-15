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
  }
};

export default productService;
