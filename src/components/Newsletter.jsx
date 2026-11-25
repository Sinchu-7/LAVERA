
import { useState } from "react";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import "../styles/Newsletter.css";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSubscribed(true);
    setEmail("");
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-decoration decoration-one">✿</div>
      <div className="newsletter-decoration decoration-two">🦋</div>

      <div className="newsletter-content">
        <span className="newsletter-label">
          <Sparkles size={15} />
          A LITTLE BEAUTY IN YOUR INBOX
        </span>

        <h2>Stay in Your <em>Glow.</em></h2>

        <p>
          Subscribe to receive beauty tips, skincare secrets,
          exclusive offers and a little dose of self-love.
        </p>

        <form className="newsletter-form" onSubmit={handleSubscribe}>
          <div className="newsletter-input">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit">
            Subscribe <ArrowRight size={17} />
          </button>
        </form>

        {subscribed && (
          <p className="subscribe-success">
            Thank you! You're on our beauty list. ♡
          </p>
        )}

        <small>By subscribing, you agree to receive LAVÉRA updates.</small>
      </div>
    </section>
  );
}

export default Newsletter;
