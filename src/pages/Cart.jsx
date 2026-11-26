
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";

import "../styles/Cart.css";

function Cart() {

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("lavera-cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("lavera-cart", JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (id, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(0, item.quantity + change),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const shipping =
    subtotal === 0 || subtotal >= 999 ? 0 : 50;

  const total = subtotal + shipping;

  return (
    <section className="cart-page">

      <div className="cart-heading">
        <span>YOUR BEAUTY COLLECTION</span>

        <h1>
          Shopping <em>Bag</em>
        </h1>

        <p>
          Your little moments of beauty are waiting for you.
        </p>
      </div>

      {cart.length === 0 ? (

        <div className="empty-cart">

          <ShoppingBag size={55} />

          <h2>
            Your bag is waiting for something beautiful.
          </h2>

          <p>
            Explore our collection and find your favourites.
          </p>

          <Link to="/" className="continue-shopping">
            Continue Shopping
          </Link>

        </div>

      ) : (

        <div className="cart-layout">

          <div className="cart-items">

            {cart.map((item) => (

              <article className="cart-item" key={item.id}>

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div className="cart-item-details">

                  <span>{item.category}</span>

                  <h3>{item.name}</h3>

                  <strong>₹{item.price}</strong>

                  <div className="quantity-controls">

                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>

                  </div>

                </div>

                <div className="cart-item-actions">

                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>

                  <button
                    className="remove-item"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </article>

            ))}

            <Link to="/" className="continue-link">
              ← Continue Shopping
            </Link>

          </div>

          <aside className="cart-summary">

            <h2>Order Summary</h2>

            <div>
              <span>Subtotal</span>
              <strong>₹{subtotal}</strong>
            </div>

            <div>
              <span>Shipping</span>
              <strong>
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </strong>
            </div>

            <p className="shipping-note">
              {subtotal >= 999
                ? "You've unlocked free shipping!"
                : `Add ₹${999 - subtotal} more for free shipping.`}
            </p>

            <div className="cart-total">
              <span>Total</span>
              <strong>₹{total}</strong>
            </div>

            <button
              className="checkout-button"
              onClick={() => alert("Checkout will be available soon!")}
            >
              Proceed to Checkout →
            </button>

            <small>
              Secure checkout · Made with love ♡
            </small>

          </aside>

        </div>

      )}

    </section>
  );
}

export default Cart;
