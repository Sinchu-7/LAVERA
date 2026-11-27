import { useState } from "react";
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Check,
  ShieldCheck,
  Sparkles,
  Truck,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ProductDetail.css";

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function ProductDetailModal({ product, onClose }) {
  if (!product) return null;

  const productId = product._id || product.id;
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const [isWishlisted, setIsWishlisted] = useState(() =>
    readStorage("lavera-wishlist").some(
      (item) => (item._id || item.id) === productId
    )
  );

  const originalPrice = product.originalPrice || product.oldPrice || 0;
  const currentPrice = Number(product.price) || 0;
  const discountPercent =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

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
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...cart, { ...product, id: productId, quantity }];

    localStorage.setItem("lavera-cart", JSON.stringify(updated));
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <AnimatePresence>
      <div className="product-modal-backdrop" onClick={onClose}>
        <motion.div
          className="product-modal-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25 }}
        >
          <button className="modal-close-btn" onClick={onClose} aria-label="Close details">
            <X size={20} />
          </button>

          <div className="modal-grid">
            <div className="modal-image-col">
              <div className="modal-image-frame">
                <img src={product.image} alt={product.name} />
                {discountPercent > 0 && (
                  <span className="modal-discount-tag">{discountPercent}% OFF</span>
                )}
              </div>
            </div>

            <div className="modal-details-col">
              <span className="modal-category">{product.category}</span>
              <h2 className="modal-title">{product.name}</h2>

              <div className="modal-rating-row">
                <div className="rating-stars">
                  <Star size={16} fill="#eab308" color="#eab308" />
                  <strong>{Number(product.rating || 4.8).toFixed(1)}</strong>
                  <span>({product.reviews || 42} community reviews)</span>
                </div>
                {product.stock > 0 ? (
                  <span className="stock-tag in-stock">
                    <Check size={13} /> In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="stock-tag out-of-stock">Out of Stock</span>
                )}
              </div>

              <div className="modal-price-row">
                <span className="modal-current-price">₹{currentPrice}</span>
                {originalPrice > currentPrice && (
                  <del className="modal-orig-price">₹{originalPrice}</del>
                )}
                <span className="tax-note">Inclusive of all taxes</span>
              </div>

              <div className="modal-tabs-header">
                <button
                  className={`modal-tab-btn ${activeTab === "description" ? "active" : ""}`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  className={`modal-tab-btn ${activeTab === "ingredients" ? "active" : ""}`}
                  onClick={() => setActiveTab("ingredients")}
                >
                  Ingredients
                </button>
                <button
                  className={`modal-tab-btn ${activeTab === "ritual" ? "active" : ""}`}
                  onClick={() => setActiveTab("ritual")}
                >
                  How to Use
                </button>
              </div>

              <div className="modal-tab-body">
                {activeTab === "description" && (
                  <p>{product.description || "A botanical luxury blend designed to nourish, soothe, and illuminate your skin with natural glow and deep hydration."}</p>
                )}
                {activeTab === "ingredients" && (
                  <p>French Lavender Extract, Organic Rosehip Seed Oil, Multi-Molecular Hyaluronic Acid, Vitamin E & Botanical Glycerin. 100% Vegan & Cruelty-Free.</p>
                )}
                {activeTab === "ritual" && (
                  <p>Warm 3-4 drops between clean palms and gently press onto cleansed face, neck, and decollete in uplifting circular motions. Use morning and night.</p>
                )}
              </div>

              <div className="modal-actions-area">
                <div className="modal-qty-selector">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={product.stock > 0 && quantity >= product.stock}
                  >
                    +
                  </button>
                </div>

                <button
                  className={`modal-add-cart-btn ${added ? "added" : ""}`}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? (
                    "Currently Out of Stock"
                  ) : added ? (
                    <><Check size={18} /> Added to Your Bag!</>
                  ) : (
                    <><ShoppingBag size={18} /> Add {quantity} to Bag</>
                  )}
                </button>

                <button
                  className={`modal-wishlist-btn ${isWishlisted ? "active" : ""}`}
                  onClick={handleWishlist}
                  aria-label="Wishlist"
                >
                  <Heart size={20} fill={isWishlisted ? "#d65b91" : "none"} />
                </button>
              </div>

              <div className="modal-perks">
                <div>
                  <Truck size={16} /> Free Delivery above ₹999
                </div>
                <div>
                  <Sparkles size={16} /> 100% Clean Formulation
                </div>
                <div>
                  <RotateCcw size={16} /> 15-Day Easy Returns
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ProductDetailModal;
