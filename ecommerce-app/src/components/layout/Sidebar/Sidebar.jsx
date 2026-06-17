import React from 'react';
import { Star, RefreshCw } from 'lucide-react';
import { useProducts } from '../../../context/ProductContext/ProductContext';
import { SORT_OPTIONS } from '../../../utils/constants';
import './Sidebar.css';

export function Sidebar() {
  const { filters, setFilter, resetFilters, products, categories } = useProducts();

  const handleCategorySelect = (category) => {
    setFilter('category', category);
  };

  const handlePriceChange = (e) => {
    const val = parseInt(e.target.value);
    setFilter('priceRange', [0, val]);
  };

  const handleRatingSelect = (rating) => {
    setFilter('minRating', rating === filters.minRating ? 0 : rating);
  };

  const handleSortChange = (e) => {
    setFilter('sortBy', e.target.value);
  };

  // Helper to capitalize first letter
  const formatCategoryName = (cat) => {
    if (!cat) return '';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  // Extract unique brands dynamically from products list
  const brands = products.length > 0 
    ? [...new Set(products.map(p => p.brand).filter(Boolean))].sort()
    : [];

  // Find max price to dynamically cap slider
  const maxProductPrice = products.length > 0 
    ? Math.ceil(Math.max(...products.map(p => p.price)))
    : 50000;

  return (
    <aside className="sidebar-aside glass-card">
      <div className="sidebar-header">
        <h3 className="sidebar-title">Filters</h3>
        <button className="sidebar-reset-btn" onClick={resetFilters} aria-label="Reset filters">
          <RefreshCw size={14} />
          Reset
        </button>
      </div>

      {/* Categories Section */}
      <div className="sidebar-section">
        <h4 className="sidebar-section-title">Categories</h4>
        <div className="sidebar-categories-list">
          <button
            className={`category-filter-item ${filters.category === 'all' ? 'category-active' : ''}`}
            onClick={() => handleCategorySelect('all')}
          >
            All Products
          </button>
          {categories.map((catName) => (
            <button
              key={catName}
              className={`category-filter-item ${filters.category === catName ? 'category-active' : ''}`}
              onClick={() => handleCategorySelect(catName)}
            >
              {formatCategoryName(catName)}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Section */}
      <div className="sidebar-section">
        <h4 className="sidebar-section-title">Sort By</h4>
        <select 
          className="sidebar-select" 
          value={filters.sortBy} 
          onChange={handleSortChange}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
      </div>

      {/* Brands Section */}
      {brands.length > 0 && (
        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Brands</h4>
          <select 
            className="sidebar-select" 
            value={filters.brand || 'all'} 
            onChange={(e) => setFilter('brand', e.target.value)}
          >
            <option value="all">All Brands</option>
            {brands.map((brandName) => (
              <option key={brandName} value={brandName}>
                {brandName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Price Range Section */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <h4 className="sidebar-section-title">Max Price</h4>
          <span className="price-value">₹{filters.priceRange[1]}</span>
        </div>
        <input
          type="range"
          min="0"
          max={maxProductPrice}
          step="5"
          value={filters.priceRange[1]}
          onChange={handlePriceChange}
          className="sidebar-price-range"
        />
        <div className="price-range-limits">
          <span>₹0</span>
          <span>₹{maxProductPrice}</span>
        </div>
      </div>

      {/* Ratings Section */}
      <div className="sidebar-section">
        <h4 className="sidebar-section-title">Customer Reviews</h4>
        <div className="sidebar-ratings-list">
          {[4, 3, 2, 1].map((num) => (
            <button
              key={num}
              onClick={() => handleRatingSelect(num)}
              className={`rating-filter-item ${filters.minRating === num ? 'rating-active' : ''}`}
            >
              <div className="rating-stars">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={14}
                    className={idx < num ? 'star-filled' : 'star-empty'}
                  />
                ))}
              </div>
              <span className="rating-label">& Up</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
