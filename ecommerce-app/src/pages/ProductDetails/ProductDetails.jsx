import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, ChevronLeft } from 'lucide-react';
import { useProducts } from '../../context/ProductContext/ProductContext';
import { useCart } from '../../hooks/useCart';
import productService from '../../services/productService';
import Loader from '../../components/common/Loader/Loader';
import Button from '../../components/common/Button/Button';
import ErrorView from '../../components/common/Error/ErrorView';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import formatCurrency from '../../utils/formatCurrency';
import './ProductDetails.css';

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted, products } = useProducts();
  const { cartItems, addToCart, removeFromCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detail pane option states
  const [activeImage, setActiveImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Flipkart-style inner lens zoom styling and mouse trackers
  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: 'center center',
    transform: 'scale(1)'
  });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.2)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  // Fetch product detail on id change
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getProductById(id);
        if (!data) throw new Error('Product not found');
        setProduct(data);
        setActiveImage(data.image);
        setSelectedColor(data.colors ? data.colors[0] : '');
        setSelectedSize(data.sizes ? data.sizes[0] : '');
        setQuantity(1);
      } catch (err) {
        setError(err.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const isInCart = product && cartItems.some(
    (item) =>
      item.id === product.id &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize
  );

  const handleCartClick = () => {
    if (!product) return;
    setAddingToCart(true);
    setTimeout(() => {
      if (isInCart) {
        removeFromCart(product.id, selectedColor, selectedSize);
      } else {
        addToCart(product, quantity, selectedColor, selectedSize);
      }
      setAddingToCart(false);
    }, 500);
  };

  if (loading) return <Loader type="fullscreen" />;
  if (error || !product) {
    return (
      <div className="product-error-container container flex flex-col align-center justify-center">
        <ErrorView message={error || 'Failed to resolve product details.'} onRetry={() => navigate('/shop')} />
      </div>
    );
  }

  // Get related category items
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="product-details-page container">
      {/* Back navigation */}
      <button className="back-navigation-btn flex align-center gap-xs" onClick={() => navigate(-1)}>
        <ChevronLeft size={16} />
        <span>Back to catalog</span>
      </button>

      {/* Main product pane split */}
      <div className="details-layout-grid">
        {/* Left Side: Images View */}
        <div className="details-images-col">
          <div 
            className="main-image-wrapper glass-panel"
            style={{ overflow: 'hidden', cursor: 'zoom-in', position: 'relative' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img 
              src={activeImage} 
              alt={product.name} 
              className="details-main-img" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.15s ease-out, transform-origin 0.15s ease-out',
                ...zoomStyle
              }}
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="thumbnails-wrapper">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumbnail-btn glass-panel ${activeImage === img ? 'thumbnail-active' : ''}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt={`${product.name} Thumbnail ${idx + 1}`} className="thumbnail-img" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details pane info */}
        <div className="details-info-col text-left">
          <span className="details-category-tag">{product.category}</span>
          <h1 className="details-title">{product.name}</h1>

          {/* Ratings indicators */}
          <div className="details-rating-wrapper flex align-center gap-sm">
            <div className="rating-stars">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={16}
                  className={idx < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}
                />
              ))}
            </div>
            <span className="rating-text">
              {product.rating} / 5.0 ({product.reviewCount} customer reviews)
            </span>
          </div>

          <span className="details-price">{formatCurrency(product.price)}</span>
          <p className="details-description">{product.description}</p>

          <hr className="details-divider" />

          {/* Color options */}
          {product.colors && product.colors.length > 0 && (
            <div className="options-section">
              <h4 className="options-title">Selected Color: <span className="option-active-val">{selectedColor}</span></h4>
              <div className="colors-palette">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`color-selector-btn ${selectedColor === color ? 'color-active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  >
                    <span
                      className="color-dot"
                      style={{
                        backgroundColor:
                          color === 'Electric Purple'
                            ? '#a855f7'
                            : color === 'Hyper White'
                            ? '#ffffff'
                            : color === 'Carbon Black' || color === 'Stealth Obsidian' || color === 'Midnight Ash' || color === 'Neon Matte Black' || color === 'Midnight Black'
                            ? '#18181b'
                            : color === 'Ghost Gray' || color === 'Liquid Platinum' || color === 'Alabaster White'
                            ? '#d4d4d8'
                            : color === 'Sunset Copper'
                            ? '#ea580c'
                            : color === 'Cyber Yellow'
                            ? '#eab308'
                            : color === 'Galaxy Teal'
                            ? '#0d9488'
                            : color === 'Supernova Pink'
                            ? '#db2777'
                            : '#6366f1'
                      }}
                    ></span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size options */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="options-section">
              <h4 className="options-title">Select Size:</h4>
              <div className="sizes-grid">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-selector-btn ${selectedSize === size ? 'size-active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector + Add Actions */}
          <div className="actions-section flex align-center gap-md">
            <div className="quantity-counter flex align-center">
              <button
                className="qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <Button
              variant={isInCart ? 'secondary' : 'primary'}
              size="lg"
              className={`details-add-cart-btn ${isInCart ? 'cart-active' : ''}`}
              onClick={handleCartClick}
              loading={addingToCart}
              iconLeft={<ShoppingBag size={20} />}
            >
              {isInCart ? 'Remove from Shopping Cart' : 'Add to Shopping Cart'}
            </Button>

            <button
              className={`details-wishlist-btn ${isWishlisted(product.id) ? 'wishlist-active' : ''}`}
              onClick={() => toggleWishlist(product.id)}
              aria-label="Toggle wishlist"
            >
              <Heart size={20} />
            </button>
          </div>

          <hr className="details-divider" />

          {/* Bullet specifications list */}
          <div className="details-specs-section">
            <h4 className="options-title">Product Highlights</h4>
            <ul className="details-specs-list">
              {product.features && product.features.map((feat, idx) => (
                <li key={idx} className="flex align-center gap-xs">
                  <span className="spec-bullet-dot"></span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Assurances HUD */}
          <div className="assurances-hud-grid">
            <div className="assurance-hud-item flex align-center gap-sm">
              <Truck size={18} className="text-secondary" />
              <div>
                <span className="assurance-hud-title">Free Shipping</span>
                <span className="assurance-hud-desc">Orders above $99</span>
              </div>
            </div>
            <div className="assurance-hud-item flex align-center gap-sm">
              <RefreshCw size={18} className="text-secondary" />
              <div>
                <span className="assurance-hud-title">Hassle-Free Returns</span>
                <span className="assurance-hud-desc">30-day return window</span>
              </div>
            </div>
            <div className="assurance-hud-item flex align-center gap-sm">
              <ShieldCheck size={18} className="text-secondary" />
              <div>
                <span className="assurance-hud-title">Secure SSL Encrypted</span>
                <span className="assurance-hud-desc">256-bit transactional security</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related Drops section */}
      {relatedProducts.length > 0 && (
        <section className="details-related-section">
          <h2 className="related-title text-left">You May Also Like</h2>
          <div className="grid-products">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

export default ProductDetails;
