import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search } from 'lucide-react';
import { useProducts } from '../../context/ProductContext/ProductContext';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Loader from '../../components/common/Loader/Loader';
import Button from '../../components/common/Button/Button';
import ErrorView from '../../components/common/Error/ErrorView';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import './ProductListing.css';

export function ProductListing() {
  const { filteredProducts, loading, error, filters, setFilter, hasMore, loadMore } = useProducts();
  const [searchParams] = useSearchParams();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Sentinel ref for infinite scroll
  const observerRef = useRef(null);

  // Sync route category search params to context
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFilter('category', categoryParam);
    }
  }, [searchParams, setFilter]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentSentinel = observerRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [hasMore, loading, loadMore]);

  if (error) {
    return (
      <div className="shop-error-container container flex justify-center align-center" style={{ minHeight: '55vh' }}>
        <ErrorView message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const showInitialLoading = loading && filteredProducts.length === 0;

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
          {showInitialLoading ? (
            <Loader type="skeleton" count={4} />
          ) : filteredProducts.length === 0 ? (
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
                {filteredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>

              {/* Infinite scroll sentinel */}
              <div ref={observerRef} className="infinite-scroll-sentinel" style={{ minHeight: '30px', margin: '20px 0' }}>
                {loading && hasMore && (
                  <div className="flex justify-center align-center" style={{ padding: '20px 0' }}>
                    <Loader type="spinner" size="md" />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductListing;
