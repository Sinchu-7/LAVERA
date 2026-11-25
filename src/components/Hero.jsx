
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero" id="home">

      <div className="hero-butterfly butterfly-one">🦋</div>
      <div className="hero-butterfly butterfly-two">🦋</div>
      <div className="hero-butterfly butterfly-three">🦋</div>

      <div className="hero-content">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="hero-label">
            <Sparkles size={16} />
            YOUR BEAUTY, YOUR MAGIC
          </span>

          <h1>
            Bloom Into
            <br />
            Your <span>Beauty.</span>
          </h1>

          <p>
            Discover the beauty of self-care with our
            luxurious skincare and beauty essentials.
            Let your natural glow take flight.
          </p>

          <div className="hero-buttons">
            <a href="#shop" className="shop-button">
              Shop Now <ArrowRight size={18} />
            </a>

            <a href="#collections" className="explore-button">
              Explore Collection
            </a>
          </div>

          <div className="hero-note">
            <span>✦</span> A little luxury, a lot of glow.
          </div>
        </motion.div>

        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="hero-image-frame">
            <img
              src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=85"
              alt="Luxury skincare beauty products"
            />
          </div>

          <div className="floating-card">
            <span>✿</span>
            <div>
              <strong>Glow Naturally</strong>
              <small>Beauty begins with care</small>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="hero-bottom">
        <span>SKINCARE</span>
        <span>✦</span>
        <span>SELF LOVE</span>
        <span>✦</span>
        <span>YOUR NATURAL GLOW</span>
      </div>
    </section>
  );
}

export default Hero;
