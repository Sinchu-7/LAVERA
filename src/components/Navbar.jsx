import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  UserRound,
  LogOut,
  Shield,
} from "lucide-react";

import WishlistDrawer from "./WishlistDrawer";
import "../styles/Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const syncCounts = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("lavera-cart") || "[]");
      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(totalItems);

      const wishlist = JSON.parse(localStorage.getItem("lavera-wishlist") || "[]");
      setWishlistCount(wishlist.length);

      const user = JSON.parse(localStorage.getItem("lavera-current-user") || "null");
      setCurrentUser(user);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    syncCounts();
    const interval = setInterval(syncCounts, 1000);
    window.addEventListener("storage", syncCounts);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", syncCounts);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("lavera-current-user");
    setCurrentUser(null);
    setMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="butterfly">🦋</span>
        <span>LAVÉRA</span>
      </Link>

      <nav className={menuOpen ? "nav-links active" : "nav-links"}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        <Link to="/shop" onClick={() => setMenuOpen(false)}>
          Shop All
        </Link>

        <a href="/#shop" onClick={() => setMenuOpen(false)}>
          Categories
        </a>

        <a href="/#collections" onClick={() => setMenuOpen(false)}>
          Best Sellers
        </a>

        <a href="/#about" onClick={() => setMenuOpen(false)}>
          Our Story
        </a>

        <Link to="/admin" className="admin-link" onClick={() => setMenuOpen(false)}>
          <Shield size={14} /> Admin
        </Link>
      </nav>

      <div className="nav-actions">
        <div className="nav-search-wrapper">
          <button
            aria-label="Search products"
            className="icon-btn"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={20} />
          </button>
          {searchOpen && (
            <form className="nav-search-popup" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search glow essentials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" aria-label="Submit search">
                <Search size={16} />
              </button>
            </form>
          )}
        </div>

        <button
          className="icon-btn wishlist-icon-link"
          aria-label="Wishlist"
          onClick={() => setWishlistOpen(true)}
        >
          <Heart size={20} />
          {wishlistCount > 0 && <span className="nav-badge">{wishlistCount}</span>}
        </button>

        <Link to="/cart" className="icon-btn cart-icon-link" aria-label="Shopping cart">
          <ShoppingBag size={20} />
          {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
        </Link>

        {currentUser ? (
          <div className="user-profile-menu">
            <span className="user-greeting">Hi, {currentUser.name.split(" ")[0]}</span>
            <button
              onClick={handleLogout}
              className="logout-mini-btn"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="login-btn">
            <UserRound size={17} />
            <span>Login</span>
          </Link>
        )}
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {menuOpen && (
        <div
          className="nav-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        onUpdateCounts={syncCounts}
      />
    </header>
  );
}

export default Navbar;
