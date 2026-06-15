import React, { createContext, useState, useEffect, useContext } from 'react';
import productService from '../../services/productService';
import { STORAGE_KEYS } from '../../utils/constants';

const ProductContext = createContext(null);

const DEFAULT_FILTERS = {
  category: 'all',
  searchQuery: '',
  priceRange: [0, 50000],
  minRating: 0,
  brand: 'all',
  sortBy: 'featured',
};

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [wishlist, setWishlist] = useState([]);

  // Fetch catalog on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Load wishlist from local storage on mount
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    } catch (e) {
      console.error('[Product Context] Error reading wishlist:', e);
    }
  }, []);

  const toggleWishlist = (productId) => {
    let newWishlist;
    if (wishlist.includes(productId)) {
      newWishlist = wishlist.filter(id => id !== productId);
    } else {
      newWishlist = [...wishlist, productId];
    }
    setWishlist(newWishlist);
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(newWishlist));
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  const setFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Resolve active products list after filters and sorting have been applied
  const getFilteredProducts = () => {
    let result = [...products];

    // Filter by Category
    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    // Filter by Search text
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // Filter by Price range
    result = result.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Filter by Brand
    if (filters.brand && filters.brand !== 'all') {
      result = result.filter(p => p.brand === filters.brand);
    }

    // Filter by Rating
    if (filters.minRating > 0) {
      result = result.filter(p => p.rating >= filters.minRating);
    }

    // Sort products
    if (filters.sortBy === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } // 'featured' keeps original seed ordering

    return result;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        filters,
        wishlist,
        setFilter,
        resetFilters,
        toggleWishlist,
        isWishlisted,
        filteredProducts: getFilteredProducts(),
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used inside a ProductProvider');
  return context;
};

export default ProductContext;
