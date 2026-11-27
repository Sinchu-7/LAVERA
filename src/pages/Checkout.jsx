import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  ShoppingBag,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  Calendar,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
  const [orderData, setOrderData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingMethod, setShippingMethod] = useState("standard");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("lavera-current-user") || "null");
      if (user) {
        setForm((prev) => ({
          ...prev,
          name: prev.name || user.name || "",
          email: prev.email || user.email || "",
        }));
      }
    } catch {
      // ignore
    }
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  const baseShipping = subtotal >= 999 ? 0 : 50;
  const shippingFee = shippingMethod === "express" ? baseShipping + 99 : baseShipping;
  const total = subtotal + shippingFee;

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email address is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Enter a valid email address (e.g. name@domain.com)";
        return "";
      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (!/^[6-9]\d{9}$/.test(value.trim())) return "Enter a valid 10-digit mobile number";
        return "";
      case "address":
        if (!value.trim()) return "Full address is required";
        if (value.trim().length < 8) return "Please enter detailed delivery address";
        return "";
      case "city":
        if (!value.trim()) return "City is required";
        return "";
      case "state":
        if (!value.trim()) return "State is required";
        return "";
      case "pincode":
        if (!value.trim()) return "PIN code is required";
        if (!/^\d{6}$/.test(value.trim())) return "Enter a valid 6-digit postal PIN";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cart.length === 0) return;

    // Validate all fields
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(form).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
      return;
    }

    const number = "LAV" + Date.now().toString().slice(-8);
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + (shippingMethod === "express" ? 2 : 4));

    const order = {
      orderNumber: number,
      customer: form,
      items: cart,
      subtotal,
      shipping: shippingFee,
      shippingMethod,
      paymentMethod,
      total,
      estimatedDelivery: estimatedDate.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
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
      setOrderData(order);
      setPlaced(true);
    } catch {
      alert("Unable to save your order. Please try again.");
    }
  };

  if (placed && orderData) {
    return (
      <>
        <Navbar />
        <section className="checkout-page">
          <div className="order-success">
            <CheckCircle size={65} className="success-icon" />
            <span>THANK YOU FOR SHOPPING WITH LAVÉRA</span>
            <h1>Your Order Is <em>Confirmed!</em></h1>
            <p>
              Your demo order has been registered. We are preparing your botanical skincare ritual.
            </p>

            <div className="order-number">
              Order Number: <strong>{orderData.orderNumber}</strong>
            </div>

            <div className="order-confirmed-card">
              <div className="confirmed-row">
                <Calendar size={18} />
                <span>Estimated Delivery: <strong>{orderData.estimatedDelivery}</strong></span>
              </div>
              <div className="confirmed-row">
                <Truck size={18} />
                <span>Shipping: <strong>{orderData.shippingMethod === "express" ? "Priority Express" : "Standard Complimentary"}</strong></span>
              </div>
              <div className="confirmed-row">
                <Banknote size={18} />
                <span>Payment: <strong>{orderData.paymentMethod.toUpperCase()} (Demo)</strong></span>
              </div>
            </div>

            <p className="demo-notice">
              ✦ This is a portfolio demonstration store. No real payment or shipment was charged.
            </p>

            <Link to="/shop" className="checkout-submit" style={{ maxWidth: 280, margin: "20px auto 0" }}>
              Continue Shopping
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <section className="checkout-page">
          <div className="order-success">
            <ShoppingBag size={55} />
            <h1>Your bag is empty</h1>
            <p>Add products before proceeding to checkout.</p>
            <Link to="/shop" className="checkout-submit" style={{ maxWidth: 240, margin: "20px auto 0" }}>
              Explore Products
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="checkout-page">
        {/* Checkout progress breadcrumb */}
        <div className="checkout-stepper">
          <span className="step-item completed">1. Shopping Bag</span>
          <span className="step-sep">›</span>
          <span className="step-item active">2. Delivery & Payment</span>
          <span className="step-sep">›</span>
          <span className="step-item">3. Order Confirmation</span>
        </div>

        <div className="checkout-heading">
          <span>ALMOST YOURS</span>
          <h1>Secure <em>Checkout</em></h1>
          <p>Complete your delivery details and choose your preferred payment option.</p>
        </div>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-section-title">
              <Truck size={21} />
              <h2>1. Delivery Address</h2>
            </div>

            <div className="checkout-fields">
              <label>
                Full Name *
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your full name"
                  className={touched.name && errors.name ? "input-error" : ""}
                  required
                  maxLength={80}
                />
                {touched.name && errors.name && <span className="field-error">{errors.name}</span>}
              </label>

              <label>
                Email Address *
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="example@email.com"
                  className={touched.email && errors.email ? "input-error" : ""}
                  required
                />
                {touched.email && errors.email && <span className="field-error">{errors.email}</span>}
              </label>

              <label>
                Phone Number *
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="10-digit mobile number"
                  className={touched.phone && errors.phone ? "input-error" : ""}
                  maxLength={10}
                  required
                />
                {touched.phone && errors.phone && <span className="field-error">{errors.phone}</span>}
              </label>

              <label className="full-field">
                Full Address *
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="House/Flat number, apartment, street, area..."
                  className={touched.address && errors.address ? "input-error" : ""}
                  rows={3}
                  required
                />
                {touched.address && errors.address && <span className="field-error">{errors.address}</span>}
              </label>

              <label>
                City *
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="City"
                  className={touched.city && errors.city ? "input-error" : ""}
                  required
                />
                {touched.city && errors.city && <span className="field-error">{errors.city}</span>}
              </label>

              <label>
                State *
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="State"
                  className={touched.state && errors.state ? "input-error" : ""}
                  required
                />
                {touched.state && errors.state && <span className="field-error">{errors.state}</span>}
              </label>

              <label>
                PIN Code *
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="6-digit PIN code"
                  className={touched.pincode && errors.pincode ? "input-error" : ""}
                  maxLength={6}
                  required
                />
                {touched.pincode && errors.pincode && <span className="field-error">{errors.pincode}</span>}
              </label>
            </div>

            {/* Delivery speed selector */}
            <div className="shipping-method-section">
              <h3>2. Choose Delivery Speed</h3>
              <div className="delivery-options-grid">
                <label className={`delivery-option-card ${shippingMethod === "standard" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "standard"}
                    onChange={() => setShippingMethod("standard")}
                  />
                  <div>
                    <strong>Standard Delivery (3-5 Business Days)</strong>
                    <p>{baseShipping === 0 ? "Complimentary (FREE)" : "₹50.00"}</p>
                  </div>
                </label>

                <label className={`delivery-option-card ${shippingMethod === "express" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "express"}
                    onChange={() => setShippingMethod("express")}
                  />
                  <div>
                    <strong>Priority Glow Express (1-2 Days)</strong>
                    <p>+₹99.00 with complimentary gift sample</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="payment-method-section">
              <h3>3. Payment Method</h3>
              <div className="payment-options-grid">
                <label className={`payment-card ${paymentMethod === "cod" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <Banknote size={20} />
                  <div>
                    <strong>Cash on Delivery</strong>
                    <small>Pay with cash or UPI upon delivery</small>
                  </div>
                </label>

                <label className={`payment-card ${paymentMethod === "upi" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                  />
                  <QrCode size={20} />
                  <div>
                    <strong>UPI / QR Code</strong>
                    <small>GPay, PhonePe, Paytm, BHIM</small>
                  </div>
                </label>

                <label className={`payment-card ${paymentMethod === "card" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <CreditCard size={20} />
                  <div>
                    <strong>Credit / Debit Card</strong>
                    <small>Visa, Mastercard, RuPay (Demo)</small>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" className="checkout-submit">
              Confirm & Place Demo Order · ₹{total.toFixed(2)}
            </button>

            <Link to="/cart" className="back-to-cart">
              <ArrowLeft size={16} /> Back to Shopping Bag
            </Link>
          </form>

          <aside className="checkout-summary">
            <h2>Your Order Summary ({cart.reduce((s, i) => s + (i.quantity || 1), 0)} items)</h2>

            <div className="checkout-products-list">
              {cart.map((item) => {
                const itemId = item._id || item.id;
                return (
                  <div className="checkout-product" key={itemId}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <strong>{item.name}</strong>
                      <span>Quantity: {item.quantity || 1}</span>
                    </div>
                    <strong>₹{(Number(item.price) * (item.quantity || 1)).toFixed(2)}</strong>
                  </div>
                );
              })}
            </div>

            <div className="checkout-divider" />

            <div className="checkout-price-row">
              <span>Subtotal</span>
              <strong>₹{subtotal.toFixed(2)}</strong>
            </div>

            <div className="checkout-price-row">
              <span>Shipping Fee</span>
              <strong>{shippingFee === 0 ? "FREE" : `₹${shippingFee.toFixed(2)}`}</strong>
            </div>

            <div className="checkout-grand-total">
              <span>Total Payable</span>
              <strong>₹{total.toFixed(2)}</strong>
            </div>

            <div className="checkout-perks">
              <div><ShieldCheck size={16} /> 256-Bit SSL Encrypted</div>
              <div><Sparkles size={16} /> Eco-Friendly Packaging</div>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Checkout;
