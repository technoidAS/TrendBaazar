import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search } from 'lucide-react';
import { useProducts } from '../../context/ProductContext/ProductContext';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Pagination from '../../components/common/Pagination/Pagination';
import Loader from '../../components/common/Loader/Loader';
import Button from '../../components/common/Button/Button';
import ErrorView from '../../components/common/Error/ErrorView';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import { PAGINATION_LIMIT } from '../../utils/constants';
import './ProductListing.css';

export function ProductListing() {
  const { filteredProducts, loading, error, filters, setFilter } = useProducts();
  const [searchParams] = useSearchParams();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync route category search params to context
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFilter('category', categoryParam);
    }
  }, [searchParams]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="shop-error-container container flex justify-center align-center" style={{ minHeight: '55vh' }}>
        <ErrorView message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  // Slice active page products
  const startIndex = (currentPage - 1) * PAGINATION_LIMIT;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PAGINATION_LIMIT);

  return (
    <div className="shop-page-container container">
      {/* Search Header Info */}
      <div className="shop-header-hud flex justify-between align-center">
        <div className="shop-hud-title text-left">
          <h1 className="shop-title">Catalog Collection</h1>
          <p className="shop-subtitle">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} matching filters
          </p>
        </div>
        
        {/* Mobile Filter toggle button */}
        <Button
          variant="outlined"
          className="mobile-filter-toggle-btn"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          iconLeft={<SlidersHorizontal size={16} />}
        >
          Filters
        </Button>
      </div>

      <div className="shop-layout-grid">
        {/* Left Side Sidebar - Hidden on mobile, toggleable overlay */}
        <div className={`shop-sidebar-wrapper ${mobileSidebarOpen ? 'mobile-sidebar-active' : ''}`}>
          <div className="mobile-sidebar-backdrop" onClick={() => setMobileSidebarOpen(false)}></div>
          <div className="sidebar-positioner">
            <Sidebar />
          </div>
        </div>

        {/* Right Side Grid Showcase */}
        <div className="shop-products-wrapper">
          {loading ? (
            <Loader type="skeleton" count={4} />
          ) : paginatedProducts.length === 0 ? (
            <div className="shop-empty-state glass-card flex flex-col justify-center align-center">
              <Search size={40} className="text-muted" />
              <h3>No products found</h3>
              <p>Try refining your query search terms or resetting the sidebar filters.</p>
              <Button variant="outlined" onClick={() => setFilter('searchQuery', '')} style={{ marginTop: 'var(--space-md)' }}>
                Reset Search Query
              </Button>
            </div>
          ) : (
            <>
              <div className="grid-products">
                {paginatedProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>

              {/* Bottom Pagination links */}
              <Pagination
                currentPage={currentPage}
                totalItems={filteredProducts.length}
                itemsPerPage={PAGINATION_LIMIT}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductListing;
