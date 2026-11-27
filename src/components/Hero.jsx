import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/Hero.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-butterfly butterfly-one">🦋</div>
      <div className="hero-butterfly butterfly-two">🦋</div>
      <div className="hero-butterfly butterfly-three">🦋</div>
      <div className="hero-sparkle sparkle-one">✦</div>
      <div className="hero-sparkle sparkle-two">✧</div>

      <div className="hero-content">
        <motion.div
          className="hero-text"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span className="hero-label" variants={itemVariants}>
            <Sparkles size={16} className="sparkle-icon-pulse" />
            YOUR BEAUTY, YOUR MAGIC
          </motion.span>

          <motion.h1 variants={itemVariants}>
            Bloom Into
            <br />
            Your <span>Beauty.</span>
          </motion.h1>

          <motion.p variants={itemVariants}>
            Discover the beauty of self-care with our luxurious skincare and
            beauty essentials. Let your natural glow take flight with pure
            botanical formulas designed for your skin.
          </motion.p>

          <motion.div className="hero-buttons" variants={itemVariants}>
            <Link to="/shop" className="shop-button">
              Shop Now <ArrowRight size={18} />
            </Link>

            <a href="#collections" className="explore-button">
              Explore Collection
            </a>
          </motion.div>

          <motion.div className="hero-note" variants={itemVariants}>
            <span>✦</span> A little luxury, a lot of glow.
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-image-frame">
            <img
              src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=85"
              alt="Luxury skincare beauty products"
            />
          </div>

          <motion.div
            className="floating-card"
            animate={{ y: [0, -9, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4.5,
              ease: "easeInOut",
            }}
          >
            <span>✿</span>
            <div>
              <strong>Glow Naturally</strong>
              <small>
                <Star size={11} fill="#eab308" color="#eab308" style={{ display: 'inline', marginRight: 3 }} />
                Rated 4.9 by 2,000+ happy skin lovers
              </small>
            </div>
          </motion.div>
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
