import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Sun, Moon, User, LogOut, ShieldAlert, Search, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { useCart } from '../../../hooks/useCart';
import { useDebounce } from '../../../hooks/useDebounce';
import { useProducts } from '../../../context/ProductContext/ProductContext';
import { useTheme } from '../../../context/ThemeContext/ThemeContext';
import { useToast } from '../../../context/ToastContext/ToastContext';
import './Navbar.css';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const { wishlist, setFilter, filters } = useProducts();
  const { isDark, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmedQuery = debouncedSearchQuery.trim();

    setFilter('searchQuery', trimmedQuery);

    if (trimmedQuery) {
      navigate('/shop');
    }
  }, [debouncedSearchQuery, navigate, setFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilter('searchQuery', searchQuery.trim());
      navigate('/shop');
    }
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setFilter('searchQuery', '');
  };

  const handleLogoClick = () => {
    setFilter('searchQuery', '');
  };

  return (
    <header className="navbar-header glass-panel">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo" onClick={handleLogoClick}>
          Trend<span className="logo-accent">Baazar</span>
        </Link>

        <nav className="navbar-actions">
          <Link to="/shop" className="navbar-link">
            Shop
          </Link>

          <div className={`navbar-search ${searchOpen ? 'navbar-search-expanded' : ''}`} ref={searchRef}>
            <div className="navbar-search-input-wrapper">
              <form onSubmit={handleSearchSubmit}>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="navbar-search-input"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                />
              </form>
              {searchOpen && (
                <button
                  type="button"
                  className="navbar-search-clear"
                  onClick={handleSearchClose}
                  aria-label="Close search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              className="navbar-icon-btn"
              onClick={() => {
                setSearchQuery(filters.searchQuery || '');
                setSearchOpen(true);
              }}
              aria-label="Open search"
            >
              <Search size={20} />
            </button>
          </div>

          <button className="navbar-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link to="/wishlist" className="navbar-icon-btn navbar-badge-wrapper" aria-label="Wishlist page">
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="navbar-badge badge-primary">{wishlist.length}</span>
            )}
          </Link>

          <Link to="/cart" className="navbar-icon-btn navbar-badge-wrapper" aria-label="Cart page">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="navbar-badge badge-cyan">{cartCount}</span>
            )}
          </Link>

          <div className="navbar-profile-container" ref={profileRef}>
            {isAuthenticated ? (
              <>
                <button
                  className="navbar-avatar-btn"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  aria-label="Profile actions"
                  aria-expanded={profileDropdownOpen}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="navbar-avatar-img" />
                  ) : (
                    <div className="navbar-avatar-fallback">
                      {user.name
                        ? user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)
                        : 'U'}
                    </div>
                  )}
                </button>

                {profileDropdownOpen && (
                  <div className="navbar-dropdown anim-slide-down">
                    <div className="navbar-dropdown-header">
                      <p className="dropdown-username">{user.name}</p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="navbar-dropdown-item"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="navbar-dropdown-item navbar-dropdown-admin"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <ShieldAlert size={16} />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      className="navbar-dropdown-item navbar-dropdown-logout"
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        addToast('Successfully signed out.', 'info');
                      }}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="navbar-login-btn">
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
