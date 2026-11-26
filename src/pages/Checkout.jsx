
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  ShoppingBag,
  Truck,
} from "lucide-react";

import "../styles/Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [cart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("lavera-cart") || "[]");
    } catch {
      return [];
    }
  });

  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const shipping = subtotal >= 999 ? 0 : 50;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cart.length === 0) return;

    const number = "LAV" + Date.now().toString().slice(-8);

    const order = {
      orderNumber: number,
      customer: form,
      items: cart,
      subtotal,
      shipping,
      total,
      date: new Date().toISOString(),
      status: "Demo order placed",
    };

    try {
      const previousOrders = JSON.parse(
        localStorage.getItem("lavera-orders") || "[]"
      );

      localStorage.setItem(
        "lavera-orders",
        JSON.stringify([...previousOrders, order])
      );

      localStorage.removeItem("lavera-cart");

      setOrderNumber(number);
      setPlaced(true);
    } catch {
      alert("Unable to save your order. Please try again.");
    }
  };

  if (placed) {
    return (
      <section className="checkout-page">
        <div className="order-success">
          <CheckCircle size={65} />
          <span>THANK YOU FOR SHOPPING WITH LAVERA</span>
          <h1>Your Order Is <em>Confirmed!</em></h1>
          <p>
            Your demo order has been saved successfully.
          </p>

          <div className="order-number">
            Order Number: <strong>{orderNumber}</strong>
          </div>

          <p className="demo-notice">
            This is a demonstration order. No payment was collected
            and no real shipment has been arranged.
          </p>

          <Link to="/shop" className="checkout-submit">
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="checkout-page">
        <div className="order-success">
          <ShoppingBag size={55} />
          <h1>Your bag is empty</h1>
          <p>Add products before proceeding to checkout.</p>
          <Link to="/shop" className="checkout-submit">
            Explore Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="checkout-heading">
        <span>ALMOST YOURS</span>
        <h1>Secure <em>Checkout</em></h1>
        <p>Just a few details before your beauty arrives.</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-section-title">
            <Truck size={21} />
            <h2>Delivery Information</h2>
          </div>

          <div className="checkout-fields">
            <label>
              Full Name *
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                maxLength={80}
              />
            </label>

            <label>
              Email Address *
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
              />
            </label>

            <label>
              Phone Number *
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                maxLength={10}
                required
              />
            </label>

            <label className="full-field">
              Full Address *
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="House number, street, area..."
                rows={4}
                required
              />
            </label>

            <label>
              City *
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </label>

            <label>
              State *
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                required
              />
            </label>

            <label>
              PIN Code *
              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="6-digit PIN code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
              />
            </label>
          </div>

          <div className="payment-demo">
            <h3>Payment Method</h3>
            <div className="demo-payment-option">
              <CheckCircle size={19} />
              <div>
                <strong>Demo Checkout</strong>
                <p>Payment gateway integration will be added later.</p>
              </div>
            </div>
          </div>

          <button type="submit" className="checkout-submit">
            Place Demo Order · ₹{total.toFixed(2)}
          </button>

          <Link to="/cart" className="back-to-cart">
            <ArrowLeft size={16} /> Back to Shopping Bag
          </Link>
        </form>

        <aside className="checkout-summary">
          <h2>Your Order</h2>

          {cart.map((item) => (
            <div className="checkout-product" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <span>Quantity: {item.quantity}</span>
              </div>
              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))}

          <div className="checkout-divider" />

          <div className="checkout-price-row">
            <span>Subtotal</span>
            <strong>₹{subtotal.toFixed(2)}</strong>
          </div>

          <div className="checkout-price-row">
            <span>Shipping</span>
            <strong>{shipping === 0 ? "FREE" : `₹${shipping}`}</strong>
          </div>

          <div className="checkout-grand-total">
            <span>Total</span>
            <strong>₹{total.toFixed(2)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Checkout;
