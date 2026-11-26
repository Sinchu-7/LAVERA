
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  UserRound,
} from "lucide-react";

import "../styles/Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">

      <Link to="/" className="navbar-logo">
        <span className="butterfly">🦋</span>
        <span>LAVÉRA</span>
      </Link>

      <nav className={menuOpen ? "nav-links active" : "nav-links"}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>

        <a href="/#shop" onClick={() => setMenuOpen(false)}>
          Shop
        </a>

        <a href="/#skincare" onClick={() => setMenuOpen(false)}>
          Skincare
        </a>

        <a href="/#makeup" onClick={() => setMenuOpen(false)}>
          Makeup
        </a>

        <a href="/#about" onClick={() => setMenuOpen(false)}>
          About
        </a>
      </nav>

      <div className="nav-actions">

        <button aria-label="Search">
          <Search />
        </button>

        <button aria-label="Wishlist">
          <Heart />
        </button>

        <Link to="/cart" aria-label="Shopping cart">
          <ShoppingBag />
        </Link>

        <button className="login-btn">
          <UserRound size={17} />
          Login
        </button>

      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X /> : <Menu />}
      </button>

    </header>
  );
}

export default Navbar;
