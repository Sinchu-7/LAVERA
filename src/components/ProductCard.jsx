
import { useState } from "react";
import { Heart, ShoppingBag, Star, Check } from "lucide-react";
import { motion } from "framer-motion";

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function ProductCard({ product }) {
  const productId = product._id || product.id;

  const [isWishlisted, setIsWishlisted] = useState(() =>
    readStorage("lavera-wishlist").some(
      (item) => (item._id || item.id) === productId
    )
  );

  const [added, setAdded] = useState(false);

  const handleWishlist = () => {
    const saved = readStorage("lavera-wishlist");

    const updated = isWishlisted
      ? saved.filter((item) => (item._id || item.id) !== productId)
      : [...saved, product];

    localStorage.setItem("lavera-wishlist", JSON.stringify(updated));
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = () => {
    const cart = readStorage("lavera-cart");

    const existing = cart.find(
      (item) => (item._id || item.id) === productId
    );

    const updated = existing
      ? cart.map((item) =>
          (item._id || item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cart, { ...product, id: productId, quantity: 1 }];

    localStorage.setItem("lavera-cart", JSON.stringify(updated));

    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.article
      className="product-card"
      whileHover={{ y: -7 }}
      transition={{ duration: 0.25 }}
    >
      <div className="product-image">
        <img src={product.image} alt={product.name} />

        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}

        <motion.button
          type="button"
          className={`wishlist-button ${isWishlisted ? "wishlisted" : ""}`}
          onClick={handleWishlist}
          whileTap={{ scale: 0.85 }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={19} fill={isWishlisted ? "currentColor" : "none"} />
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
            <><Check size={17} /> Added to Bag!</>
          ) : (
            <><ShoppingBag size={17} /> Add to Cart</>
          )}
        </motion.button>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>

        <h3>{product.name}</h3>

        <div className="product-rating">
          <Star size={14} fill="currentColor" />
          <span>{product.rating || 0}</span>
          <small>({product.reviews || 0} reviews)</small>
        </div>

        <div className="product-price">
          ₹{product.price}
          {(product.originalPrice || product.oldPrice) && (
            <del>₹{product.originalPrice || product.oldPrice}</del>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;
