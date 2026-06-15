import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ChevronRight } from 'lucide-react';
import { useProducts } from '../../context/ProductContext/ProductContext';
import Button from '../../components/common/Button/Button';
import SlideUp from '../../components/animations/SlideUp';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import './Wishlist.css';

export function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, products } = useProducts();

  // Get wishlisted products list
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="wishlist-page-empty container glass-panel">
        <div className="empty-wishlist-circle">
          <Heart size={32} />
        </div>
        <h1 className="empty-title">Your Wishlist is Empty</h1>
        <p className="empty-subtitle" style={{ color: 'var(--text-secondary)', maxWidth: '380px', margin: '0 auto var(--space-sm) auto', lineHeight: 'var(--lh-normal)' }}>
          Save items you love here! Click the star icon on any card to add products.
        </p>
        <Button onClick={() => navigate('/shop')} variant="primary" size="lg">
          Explore Shop Collections
        </Button>
      </div>
    );
  }

  return (
    <div className="wishlist-page-container container text-left">
      <div className="wishlist-header flex justify-between align-center">
        <div>
          <h1 className="wishlist-page-title">My Wishlist</h1>
          <p className="wishlist-subtitle">You have saved {wishlistedProducts.length} items</p>
        </div>
        <Button variant="ghost" onClick={() => navigate('/shop')} iconRight={<ChevronRight size={16} />}>
          Continue Shopping
        </Button>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="wishlist-grid grid-products">
        {wishlistedProducts.map((prod, idx) => (
          <SlideUp key={prod.id} delay={idx * 50}>
            <ProductCard product={prod} />
          </SlideUp>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
