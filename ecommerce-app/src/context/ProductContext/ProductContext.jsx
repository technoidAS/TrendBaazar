import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
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
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);

  // Fetch products from backend based on current filters and page
  const fetchProducts = useCallback(async (page = 1, isAppend = false) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        pageSize: 12,
      };

      if (filters.category && filters.category !== 'all') {
        params.category = filters.category;
      }
      if (filters.searchQuery && filters.searchQuery.trim()) {
        params.search = filters.searchQuery;
      }
      if (filters.brand && filters.brand !== 'all') {
        params.brand = filters.brand;
      }
      if (filters.minRating > 0) {
        params.minRating = filters.minRating;
      }
      if (filters.priceRange) {
        params.minPrice = filters.priceRange[0];
        params.maxPrice = filters.priceRange[1];
      }
      if (filters.sortBy) {
        if (filters.sortBy === 'price-low-high') {
          params.sortBy = 'price_asc';
        } else if (filters.sortBy === 'price-high-low') {
          params.sortBy = 'price_desc';
        } else {
          params.sortBy = filters.sortBy;
        }
      }

      const data = await productService.getProducts(params);
      const newProducts = data.products || [];

      if (isAppend) {
        setProducts(prev => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
      }

      setHasMore(data.hasMore ?? false);
      setCurrentPage(data.page ?? page);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch categories matching the active search query
  const fetchCategories = async (search = '') => {
    try {
      const data = await productService.getCategories(search);
      setCategories(data);
    } catch (err) {
      console.error('[Product Context] Failed to load categories:', err);
    }
  };

  // Trigger search-scoped categories reload
  useEffect(() => {
    fetchCategories(filters.searchQuery);
  }, [filters.searchQuery]);

  // Reset page and reload products on filter changes
  useEffect(() => {
    fetchProducts(1, false);
  }, [fetchProducts]);

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

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => {
      if (prev[key] === value) {
        return prev;
      }
      return {
        ...prev,
        [key]: value,
      };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchProducts(currentPage + 1, true);
    }
  }, [loading, hasMore, currentPage, fetchProducts]);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        filters,
        wishlist,
        categories,
        hasMore,
        currentPage,
        setFilter,
        resetFilters,
        toggleWishlist,
        isWishlisted,
        filteredProducts: products,
        loadMore,
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
