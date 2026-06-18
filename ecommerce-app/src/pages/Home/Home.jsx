import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Award, Shield, Zap, Sparkles, TrendingUp, Star } from 'lucide-react';
import { useProducts } from '../../context/ProductContext/ProductContext';
import { useCart } from '../../hooks/useCart';
import { PRODUCT_CATEGORIES } from '../../utils/constants';
import Button from '../../components/common/Button/Button';
import SlideUp from '../../components/animations/SlideUp';
import FadeIn from '../../components/animations/FadeIn';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import './Home.css';

const SHOWCASE_ITEMS = [
  { id: 1, type: 'Featured Drop', name: 'Quantum Flux Sneakers', price: '₹9,999', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80' },
  { id: 8, type: 'Apparel', name: 'Urban Shell Jacket', price: '₹5,499', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80' },
  { id: 3, type: 'Gadgets', name: 'Aero Noise-Cancelling', price: '₹12,999', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' },
  { id: 5, type: 'Accessories', name: 'Tactical Backpack', price: '₹3,299', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80' },
  { id: 5, type: 'Tech', name: 'Holo Smartwatch', price: '₹15,499', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80' }
];

const COOLORS_PALETTE = [
  '#f97316',
  '#14b8a6',
  '#f59e0b',
  '#6366f1',
  '#10b981',
  '#fafaf9',
  '#f43f5e',
  '#eab308'
];

const AnimText = ({ text, plain = false }) => {
    return (
      <span className="coolors-text-container">
        {text.split('').map((char, idx) => {
          if (char === ' ') {
            return <span key={idx} className="coolors-space">&nbsp;</span>;
          }
          const color = plain ? 'currentColor' : COOLORS_PALETTE[idx % COOLORS_PALETTE.length];
          const initRot = idx % 2 === 0 ? '-7deg' : '5deg';
          const midRot = idx % 2 === 0 ? '6deg' : '-5deg';
          const delay = `${idx * 0.05}s`;
          return (
            <span
              key={idx}
              className="coolors-char"
              style={{
                animationDelay: delay,
                '--char-color': color,
                '--init-rot': initRot,
                '--mid-rot': midRot
              }}
            >
              {char}
            </span>
          );
        })}
      </span>
    );
  };

export function Home() {
  const navigate = useNavigate();
  const { products, toggleWishlist, isWishlisted } = useProducts();
  const { addToCart } = useCart();
  const [activeIndex, setActiveIndex] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayTimerRef = useRef(null);

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  const categoryCards = useMemo(() => {
    const uniqueIds = [...new Set(products.map(p => p.category))];
    return uniqueIds.map(id => {
      const catProducts = products.filter(p => p.category === id);
      const info = PRODUCT_CATEGORIES.find(c => c.id === id);
      return {
        id,
        name: info?.name || id.charAt(0).toUpperCase() + id.slice(1),
        desc: `Explore ${info?.name || id}`,
        count: `${catProducts.length} Items`,
        image: catProducts[0]?.image || '',
      };
    });
  }, [products]);

  const pauseAutoPlay = useCallback(() => {
    setIsAutoPlaying(false);
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
    }
    autoPlayTimerRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 8000);
  }, []);

  const handleManualChange = useCallback((index) => {
    setActiveIndex(index);
    pauseAutoPlay();
  }, [pauseAutoPlay]);

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % SHOWCASE_ITEMS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, []);

  const handleCategoryClick = (catId) => {
    navigate(`/shop?category=${catId}`);
  };

  const handleShopClick = () => {
    navigate('/shop');
  };

  return (
    <div className="home-page-container">
      {/* 1. HERO SECTION */}
      <section className="home-hero-section">
        {/* Abstract animated background elements */}
        <div className="hero-abstract-bg">
          <div className="hero-glow-blob blob-1"></div>
          <div className="hero-glow-blob blob-2"></div>
          <div className="hero-glow-blob blob-3"></div>
          <div className="hero-grid-overlay"></div>
        </div>

        <div className="hero-container container">
          <FadeIn className="hero-content-centered">
            <div className="hero-badge-pill">
                <span className="live-dot"></span>
                <span className="pill-text">✦ 2026 Collection</span>
              </div>

              <h1 className="hero-headline">
                <span className="headline-line-1">YOUR STYLE,</span>
                <span className="headline-line-2 text-gradient">YOUR STATEMENT</span>
              </h1>

              <p className="hero-description">
                Premium fashion and cutting-edge tech, curated for those who refuse to blend in.
              </p>

            <div className="hero-cta-group">
              <Button onClick={handleShopClick} variant="primary" size="lg" className="hero-btn-primary">
                Explore Collection
              </Button>
              <Button onClick={() => navigate('/shop?category=apparel')} variant="outlined" size="lg" className="hero-btn-secondary">
                View Lookbook
              </Button>
            </div>
          </FadeIn>

          <SlideUp delay={200} className="hero-showcase-wrapper">
            <div className="hero-showcase-images">
              {SHOWCASE_ITEMS.map((item, index) => {
                let position = 'img-hidden';
                if (index === activeIndex) {
                  position = 'img-center';
                } else if (index === (activeIndex - 1 + SHOWCASE_ITEMS.length) % SHOWCASE_ITEMS.length) {
                  position = 'img-left';
                } else if (index === (activeIndex + 1) % SHOWCASE_ITEMS.length) {
                  position = 'img-right';
                }

                return (
                  <div
                    key={item.id}
                    className={`showcase-img-box ${position}`}
                    onClick={() => {
                      if (position === 'img-center') {
                        navigate(`/product/prod_${item.id}`);
                      } else {
                        handleManualChange(index);
                      }
                    }}
                  >
                    <img src={item.image} alt={item.name} />
                    {position === 'img-center' && (
                      <div className="showcase-float-card">
                        <div className="float-card-content">
                          <span className="float-tag">{item.type}</span>
                          <p className="float-name">{item.name}</p>
                        </div>
                        <div className="float-price">{item.price}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Carousel Pagination Indicators */}
            <div className="carousel-indicators">
              {SHOWCASE_ITEMS.map((_, idx) => (
                <button
                  key={idx}
                  className={`carousel-dot ${idx === activeIndex ? 'active' : ''}`}
                  onClick={() => handleManualChange(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </SlideUp>
        </div>
      </section>

      {/* 2. CORE FEATURES VALUE PROP */}
      <section className="home-features-section container">
        <div className="features-grid">
          <SlideUp delay={0}>
            <div className="feature-item">
              <div className="feature-icon-wrap">
                <Award size={22} />
              </div>
              <div className="feature-text">
                <h3 className="feature-title">Premium Quality</h3>
                <p className="feature-desc">All products are sourced directly from verified manufacturers using top-tier premium materials.</p>
              </div>
            </div>
          </SlideUp>
          <SlideUp delay={100}>
            <div className="feature-item">
              <div className="feature-icon-wrap feature-icon-teal">
                <Shield size={22} />
              </div>
              <div className="feature-text">
                <h3 className="feature-title">Encrypted Checkout</h3>
                <p className="feature-desc">Shop with complete peace of mind. Your transactions are shielded with 256-bit SSL encryption.</p>
              </div>
            </div>
          </SlideUp>
          <SlideUp delay={200}>
            <div className="feature-item">
              <div className="feature-icon-wrap feature-icon-amber">
                <Zap size={22} />
              </div>
              <div className="feature-text">
                <h3 className="feature-title">Instant Fulfillment</h3>
                <p className="feature-desc">Superfast local processing ensures your order is packaged and dispatched within 24 hours.</p>
              </div>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES SECTION */}
      <section className="home-categories-section container">
        <div className="section-header">
          <div className="section-header-text">
            <span className="section-overline">Collections</span>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <Button variant="ghost" onClick={handleShopClick} iconRight={<ArrowRight size={14} />}>
            View All
          </Button>
        </div>

        <div className="categories-scroll">
          {categoryCards.map((cat, idx) => (
            <SlideUp key={cat.id} delay={idx * 80}>
              <div className="category-card" onClick={() => handleCategoryClick(cat.id)}>
                <img src={cat.image} alt={cat.name} className="category-bg-image" />
                <div className="category-card-overlay"></div>
                <div className="category-card-content">
                  <span className="category-item-count">{cat.count}</span>
                  <h3 className="category-item-name">{cat.name}</h3>
                  <p className="category-item-desc">{cat.desc}</p>
                </div>
              </div>
            </SlideUp>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SHOWCASE */}
      <section className="home-featured-products container">
        <div className="section-header">
          <div className="section-header-text">
            <span className="section-overline">Curated Selection</span>
            <h2 className="section-title">Featured Drops</h2>
          </div>
          <Button variant="outlined" onClick={handleShopClick}>
            Explore Full Catalog
          </Button>
        </div>

        <div className="grid-products">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 5. PROMO SPECIAL DEALS SECTION */}
      <section className="home-promo-banner container">
        <div className="promo-banner-wrapper">
          <div className="promo-ambient-orb promo-orb-1"></div>
          <div className="promo-ambient-orb promo-orb-2"></div>
          <div className="promo-content">
            <span className="promo-badge">
              <TrendingUp size={13} />
              Limited Time Offer
            </span>
            
            <span className="promo-code">Use Code</span>
            <h2 className="hero-main-title">
                <AnimText text="TRENDBAZAR20" plain />
            </h2>
            <p className="promo-desc">Get an instant 20% flat discount on all premium orders. Free shipping applied on all orders exceeding ₹9,999.</p>
            <Button variant="primary" size="lg" onClick={handleShopClick} iconRight={<ArrowRight size={18} />}>
              Claim Discount Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
