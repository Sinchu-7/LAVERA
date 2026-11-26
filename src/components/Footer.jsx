
import {
  ArrowUp,
  Heart,
} from "lucide-react";

import "../styles/Footer.css";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer" id="about">

      <div className="footer-main">

        <div className="footer-brand">
          <h2>🦋 LAVÉRA</h2>

          <p>
            Beauty is not about perfection.
            It's about celebrating the beauty
            that makes you uniquely you.
          </p>

          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>

            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              Facebook
            </a>

            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              YouTube
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <a href="/#home">Home</a>
          <a href="/#shop">Shop</a>
          <a href="/#collections">Best Sellers</a>
          <a href="/#about">Our Story</a>
        </div>

        <div className="footer-column">
          <h3>Categories</h3>
          <a href="/#skincare">Skincare</a>
          <a href="/#makeup">Makeup</a>
          <a href="/#lipcare">Lip Care</a>
          <a href="/#bodycare">Body Care</a>
        </div>

        <div className="footer-column">
          <h3>Customer Care</h3>
          <a href="mailto:hello@lavera.com">Contact Us</a>
          <a href="#shipping">Shipping Information</a>
          <a href="#returns">Returns & Refunds</a>
          <a href="#faq">FAQs</a>
        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} LAVÉRA.
          Made with <Heart size={13} fill="currentColor" /> and love.
        </p>

        <button onClick={scrollToTop} aria-label="Back to top">
          Back to Top <ArrowUp size={15} />
        </button>

      </div>

    </footer>
  );
}

export default Footer;
