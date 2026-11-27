import { useState } from "react";
import { Heart, ShoppingBag, Star, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function ProductCard({ product, onSelectProduct }) {
  const productId = product._id || product.id;

  const [isWishlisted, setIsWishlisted] = useState(() =>
    readStorage("lavera-wishlist").some(
      (item) => (item._id || item.id) === productId
    )
  );

  const [added, setAdded] = useState(false);

  const originalPrice = product.originalPrice || product.oldPrice || 0;
  const currentPrice = Number(product.price) || 0;
  const discountPercent =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  const handleWishlist = (e) => {
    e.stopPropagation();
    const saved = readStorage("lavera-wishlist");

    const updated = isWishlisted
      ? saved.filter((item) => (item._id || item.id) !== productId)
      : [...saved, product];

    localStorage.setItem("lavera-wishlist", JSON.stringify(updated));
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const cart = readStorage("lavera-cart");

    const existing = cart.find(
      (item) => (item._id || item.id) === productId
    );

    const updated = existing
      ? cart.map((item) =>
          (item._id || item.id) === productId
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        )
      : [...cart, { ...product, id: productId, quantity: 1 }];

    localStorage.setItem("lavera-cart", JSON.stringify(updated));

    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <motion.article
      className="product-card"
      whileHover={{ y: -7 }}
      transition={{ duration: 0.25 }}
      onClick={handleCardClick}
      style={{ cursor: onSelectProduct ? "pointer" : "default" }}
    >
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />

        <div className="product-badges-stack">
          {product.badge && (
            <span className="product-badge featured-badge">
              <Sparkles size={10} style={{ display: 'inline', marginRight: 3 }} />
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="product-badge discount-badge">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <motion.button
          type="button"
          className={`wishlist-button ${isWishlisted ? "wishlisted" : ""}`}
          onClick={handleWishlist}
          whileTap={{ scale: 0.85 }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={18} fill={isWishlisted ? "#d65b91" : "none"} />
        </motion.button>

        <motion.button
          type="button"
          className={`quick-add ${added ? "added" : ""}`}
          onClick={handleAddToCart}
          whileTap={{ scale: 0.96 }}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? (
            "Out of Stock"
          ) : added ? (
            <><Check size={16} /> Added to Bag!</>
          ) : (
            <><ShoppingBag size={16} /> Add to Cart</>
          )}
        </motion.button>
      </div>

      <div className="product-info">
        <div className="product-meta-row">
          <span className="product-category">{product.category}</span>
          {typeof product.stock === "number" && product.stock > 0 && product.stock <= 5 && (
            <span className="low-stock-alert">Only {product.stock} left</span>
          )}
        </div>

        <h3 title={product.name}>{product.name}</h3>

        <div className="product-rating">
          <Star size={13} fill="#eab308" color="#eab308" />
          <span>{Number(product.rating || 0).toFixed(1)}</span>
          <small>({product.reviews || 0})</small>
        </div>

        <div className="product-price">
          <span className="current-price">₹{currentPrice}</span>
          {originalPrice > currentPrice && (
            <del className="original-price">₹{originalPrice}</del>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;
