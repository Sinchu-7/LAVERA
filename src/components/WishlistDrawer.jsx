import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, X, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Wishlist.css";

function WishlistDrawer({ isOpen, onClose, onUpdateCounts }) {
  const [wishlist, setWishlist] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  const loadWishlist = () => {
    try {
      const items = JSON.parse(localStorage.getItem("lavera-wishlist") || "[]");
      setWishlist(items);
    } catch {
      setWishlist([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadWishlist();
    }
  }, [isOpen]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2000);
  };

  const removeItem = (id) => {
    const updated = wishlist.filter((item) => (item._id || item.id) !== id);
    localStorage.setItem("lavera-wishlist", JSON.stringify(updated));
    setWishlist(updated);
    if (onUpdateCounts) onUpdateCounts();
    showToast("Removed from wishlist");
  };

  const clearAll = () => {
    localStorage.setItem("lavera-wishlist", JSON.stringify([]));
    setWishlist([]);
    if (onUpdateCounts) onUpdateCounts();
    showToast("Wishlist cleared");
  };

  const moveToCart = (item) => {
    const itemId = item._id || item.id;
    try {
      const cart = JSON.parse(localStorage.getItem("lavera-cart") || "[]");
      const existing = cart.find((i) => (i._id || i.id) === itemId);
      const updatedCart = existing
        ? cart.map((i) =>
            (i._id || i.id) === itemId ? { ...i, quantity: (i.quantity || 1) + 1 } : i
          )
        : [...cart, { ...item, id: itemId, quantity: 1 }];

      localStorage.setItem("lavera-cart", JSON.stringify(updatedCart));

      // Remove from wishlist
      const updatedWish = wishlist.filter((i) => (i._id || i.id) !== itemId);
      localStorage.setItem("lavera-wishlist", JSON.stringify(updatedWish));
      setWishlist(updatedWish);

      if (onUpdateCounts) onUpdateCounts();
      showToast("Moved to your bag!");
    } catch {
      // ignore
    }
  };

  const addAllToCart = () => {
    if (wishlist.length === 0) return;
    try {
      const cart = JSON.parse(localStorage.getItem("lavera-cart") || "[]");
      let currentCart = [...cart];

      wishlist.forEach((item) => {
        const itemId = item._id || item.id;
        const exists = currentCart.find((i) => (i._id || i.id) === itemId);
        if (exists) {
          currentCart = currentCart.map((i) =>
            (i._id || i.id) === itemId ? { ...i, quantity: (i.quantity || 1) + 1 } : i
          );
        } else {
          currentCart.push({ ...item, id: itemId, quantity: 1 });
        }
      });

      localStorage.setItem("lavera-cart", JSON.stringify(currentCart));
      localStorage.setItem("lavera-wishlist", JSON.stringify([]));
      setWishlist([]);
      if (onUpdateCounts) onUpdateCounts();
      showToast("All items moved to bag!");
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="wishlist-drawer-backdrop" onClick={onClose}>
        <motion.aside
          className="wishlist-drawer"
          onClick={(e) => e.stopPropagation()}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
        >
          <div className="wishlist-header">
            <div className="wishlist-title">
              <Heart size={20} fill="#70469b" color="#70469b" />
              <h3>Saved Favorites ({wishlist.length})</h3>
            </div>
            <button className="close-wishlist" onClick={onClose} aria-label="Close wishlist">
              <X size={20} />
            </button>
          </div>

          {toastMessage && (
            <div className="wishlist-toast">
              <Sparkles size={14} /> {toastMessage}
            </div>
          )}

          {wishlist.length === 0 ? (
            <div className="empty-wishlist">
              <Heart size={48} strokeWidth={1.5} color="#c8b3dc" />
              <h4>Your wishlist is empty</h4>
              <p>Save items you love so you can easily find them later.</p>
              <Link to="/shop" onClick={onClose} className="wishlist-shop-btn">
                Discover Collection <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <>
              <div className="wishlist-items-list">
                {wishlist.map((item) => {
                  const id = item._id || item.id;
                  return (
                    <article className="wishlist-item" key={id}>
                      <img src={item.image} alt={item.name} />
                      <div className="wishlist-item-info">
                        <span className="wishlist-item-category">{item.category}</span>
                        <h4>{item.name}</h4>
                        <div className="wishlist-item-price">
                          <strong>₹{item.price}</strong>
                          {(item.originalPrice || item.oldPrice) && (
                            <del>₹{item.originalPrice || item.oldPrice}</del>
                          )}
                        </div>
                      </div>
                      <div className="wishlist-item-actions">
                        <button
                          className="move-cart-btn"
                          onClick={() => moveToCart(item)}
                          title="Move to Cart"
                          aria-label={`Move ${item.name} to cart`}
                        >
                          <ShoppingBag size={16} /> Move to Bag
                        </button>
                        <button
                          className="delete-wish-btn"
                          onClick={() => removeItem(id)}
                          title="Remove item"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="wishlist-footer">
                <button className="add-all-btn" onClick={addAllToCart}>
                  <ShoppingBag size={17} /> Move All to Bag
                </button>
                <button className="clear-all-btn" onClick={clearAll}>
                  Clear Wishlist
                </button>
              </div>
            </>
          )}
        </motion.aside>
      </div>
    </AnimatePresence>
  );
}

export default WishlistDrawer;
