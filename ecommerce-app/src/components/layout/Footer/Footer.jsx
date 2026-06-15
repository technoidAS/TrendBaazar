import React, { useState } from 'react';
import { Send, ShieldCheck } from 'lucide-react';
import './Footer.css';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="footer-section">
      <div className="footer-container container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-col footer-about">
            <h3 className="footer-logo">Trend<span className="logo-accent">Baazar</span></h3>
            <p className="footer-about-text">
              Your futuristic destination for premium apparel, footwear, high-tech gadgets, and modern accessories. Curated for trendsetters.
            </p>
            <div className="footer-socials">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Github link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Twitter link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Instagram link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-col">
            <h4 className="footer-col-title">Shop Links</h4>
            <ul className="footer-links">
              <li><a href="/shop?category=apparel">Apparel</a></li>
              <li><a href="/shop?category=footwear">Footwear</a></li>
              <li><a href="/shop?category=gadgets">Gadgets</a></li>
              <li><a href="/shop?category=accessories">Accessories</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="footer-col">
            <h4 className="footer-col-title">Support</h4>
            <ul className="footer-links">
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#shipping">Shipping & Returns</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="footer-col footer-newsletter">
            <h4 className="footer-col-title">Join the Bazaar</h4>
            <p className="newsletter-text">Subscribe to receive updates on drop dates, discounts, and flash sales.</p>
            
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="newsletter-btn" aria-label="Newsletter submit">
                <Send size={16} />
              </button>
            </form>
            {subscribed && <span className="newsletter-success anim-slide-down">Successfully subscribed!</span>}
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright-text">&copy; {new Date().getFullYear()} TrendBaazar. All rights reserved.</p>
          <div className="footer-badge flex align-center gap-xs">
            <ShieldCheck size={16} className="text-brand" />
            <span>Secure SSL Encrypted Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
