import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useProducts } from '../../../context/ProductContext/ProductContext';
import formatCurrency from '../../../utils/formatCurrency';
import './ProductCard.css';

/**
 * Reusable ProductCard with a premium 3D tilt and float-in-air hover effect.
 * @param {Object} product - Product data object
 */
export function ProductCard({ product }) {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useProducts();
  const cardRef = useRef(null);

  // 3D rotation coordinates
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Mouse coords relative to card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Calculate rotation (-15deg to +15deg)
    const rX = (mouseY / (height / 2)) * -12;
    const rY = (mouseX / (width / 2)) * 12;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const cardStyle = {
    transform: isHovered
      ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      : 'rotateX(0deg) rotateY(0deg)',
    transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
  };

  return (
    <div
      className="product-card-3d-container"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className={`product-card-3d glass-card ${isHovered ? 'card-hovered' : ''}`}
        style={cardStyle}
      >
        {/* Floating 3D image layer */}
        <div className="product-card-image-3d" onClick={handleClick}>
          <img src={product.image} alt={product.name} className="product-image-layer" />
          <div className="product-image-overlay-3d">
            <span className="view-product-text-3d">Quick View</span>
          </div>
        </div>

        {/* Text descriptions layered at different elevations */}
        <div className="product-card-details-3d">
          <div className="product-meta-row-3d flex justify-between align-center">
            <span className="product-category-3d">{product.category}</span>
            <div className="product-rating-3d flex align-center gap-2xs">
              <Star size={12} className="star-filled" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 className="product-title-3d" onClick={handleClick}>
            {product.name}
          </h3>

          <div className="product-footer-3d flex justify-between align-center">
            <span className="product-price-3d">{formatCurrency(product.price)}</span>
            <div className="product-actions-3d flex gap-sm">
              <button
                className={`action-btn-3d wishlist-btn-3d ${
                  isWishlisted(product.id) ? 'wishlist-active' : ''
                }`}
                onClick={handleWishlistClick}
                aria-label="Add to wishlist"
              >
                <Star size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
