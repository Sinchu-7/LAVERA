import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  Gift,
  CheckCircle2,
  AlertCircle,
  Truck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Cart.css";

const COUPONS = {
  GLOW15: 0.15,
  LAVERA20: 0.2,
  BEAUTY10: 0.1,
};

function Cart() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("lavera-cart") || "[]");
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [giftWrapping, setGiftWrapping] = useState(false);

  useEffect(() => {
    localStorage.setItem("lavera-cart", JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (id, change) => {
    setCart((current) =>
      current
        .map((item) => {
          const itemId = item._id || item.id;
          if (itemId === id) {
            const nextQty = Math.max(0, (item.quantity || 1) + change);
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((current) => current.filter((item) => (item._id || item.id) !== id));
  };

  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear your shopping bag?")) {
      setCart([]);
      localStorage.setItem("lavera-cart", JSON.stringify([]));
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (COUPONS[code]) {
      setAppliedCoupon({ code, discount: COUPONS[code] });
      setCouponCode("");
    } else {
      setCouponError("Invalid coupon code. Try 'GLOW15' for 15% off!");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price) * (item.quantity || 1),
    0
  );

  const discountAmount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const giftWrapFee = giftWrapping ? 49 : 0;
  const shipping = subtotalAfterDiscount === 0 || subtotalAfterDiscount >= 999 ? 0 : 50;
  const total = subtotalAfterDiscount + shipping + giftWrapFee;

  const freeShippingThreshold = 999;
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <>
      <Navbar />
      <section className="cart-page">
        <div className="cart-heading">
          <span>YOUR BEAUTY COLLECTION</span>
          <h1>Shopping <em>Bag</em></h1>
          <p>Carefully selected self-care luxuries awaiting your daily glow.</p>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={55} />
            <h2>Your bag is waiting for something beautiful.</h2>
            <p>Explore our clean beauty collection and find your new skincare ritual.</p>
            <Link to="/shop" className="continue-shopping">
              Explore Collection <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              <div className="cart-items-topbar">
                <span>
                  <strong>{cart.reduce((s, i) => s + (i.quantity || 1), 0)}</strong> items in bag
                </span>
                <button className="clear-bag-btn" onClick={clearCart}>
                  Clear Bag
                </button>
              </div>

              {/* Free delivery progress meter */}
              <div className="shipping-progress-card">
                <div className="shipping-progress-header">
                  <div className="shipping-progress-title">
                    <Truck size={17} />
                    {subtotal >= freeShippingThreshold ? (
                      <strong>You've unlocked Free Complimentary Delivery!</strong>
                    ) : (
                      <span>
                        Add <strong>₹{amountForFreeShipping}</strong> more to unlock <strong>Free Delivery</strong>
                      </span>
                    )}
                  </div>
                  <span className="shipping-progress-percent">{shippingProgress}%</span>
                </div>
                <div className="shipping-progress-bar">
                  <div
                    className="shipping-progress-fill"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>

              {cart.map((item) => {
                const itemId = item._id || item.id;
                return (
                  <article className="cart-item" key={itemId}>
                    <img src={item.image} alt={item.name} />

                    <div className="cart-item-details">
                      <span>{item.category}</span>
                      <h3>{item.name}</h3>
                      <strong>₹{item.price}</strong>

                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(itemId, -1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>

                        <span>{item.quantity || 1}</span>

                        <button
                          onClick={() => updateQuantity(itemId, 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <strong>₹{(Number(item.price) * (item.quantity || 1)).toFixed(2)}</strong>
                      <button
                        className="remove-item"
                        onClick={() => removeItem(itemId)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </article>
                );
              })}

              <Link to="/shop" className="continue-link">
                ← Continue Shopping
              </Link>
            </div>

            <aside className="cart-summary">
              <h2>Order Summary</h2>

              {/* Coupon Form */}
              <form className="coupon-form" onSubmit={handleApplyCoupon}>
                <div className="coupon-input-wrap">
                  <Tag size={16} />
                  <input
                    type="text"
                    placeholder="Enter coupon code (GLOW15)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                </div>
                <button type="submit" className="apply-coupon-btn">
                  Apply
                </button>
              </form>

              {couponError && <p className="coupon-error">{couponError}</p>}

              {appliedCoupon && (
                <div className="applied-coupon-pill">
                  <span>
                    <CheckCircle2 size={14} /> <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.discount * 100}% off)
                  </span>
                  <button type="button" onClick={removeCoupon}>✕</button>
                </div>
              )}

              {/* Gift wrap option */}
              <label className="gift-wrap-option">
                <input
                  type="checkbox"
                  checked={giftWrapping}
                  onChange={(e) => setGiftWrapping(e.target.checked)}
                />
                <Gift size={16} />
                <span>Add Luxury Gift Box & Note (+₹49)</span>
              </label>

              <div className="summary-row">
                <span>Bag Subtotal</span>
                <strong>₹{subtotal.toFixed(2)}</strong>
              </div>

              {appliedCoupon && (
                <div className="summary-row discount-row">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <strong>-₹{discountAmount.toFixed(2)}</strong>
                </div>
              )}

              {giftWrapping && (
                <div className="summary-row">
                  <span>Gift Box & Packaging</span>
                  <strong>₹49.00</strong>
                </div>
              )}

              <div className="summary-row">
                <span>Shipping Delivery</span>
                <strong>
                  {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                </strong>
              </div>

              <div className="cart-total">
                <span>Total Payable</span>
                <strong>₹{total.toFixed(2)}</strong>
              </div>

              <Link to="/checkout" className="checkout-button">
                Proceed to Checkout <ArrowRight size={17} />
              </Link>

              <small>
                ✦ 100% Authentic Botanical Formulations · Secure Checkout
              </small>
            </aside>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}

export default Cart;
