import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const users = JSON.parse(
      localStorage.getItem("lavera-users") || "[]"
    );

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    // If demo test credentials used and not registered yet, auto-accept
    if (!user && email.toLowerCase() === "demo@lavera.com" && password === "lavera123") {
      localStorage.setItem(
        "lavera-current-user",
        JSON.stringify({
          name: "Lavender Lover",
          email: "demo@lavera.com",
        })
      );
      navigate("/");
      return;
    }

    if (!user) {
      setError("Invalid email or password. Please try again or use Quick Demo Login.");
      return;
    }

    localStorage.setItem(
      "lavera-current-user",
      JSON.stringify({
        name: user.name,
        email: user.email,
      })
    );

    navigate("/");
  };

  const handleQuickDemo = () => {
    setEmail("demo@lavera.com");
    setPassword("lavera123");
    localStorage.setItem(
      "lavera-current-user",
      JSON.stringify({
        name: "Lavender Lover",
        email: "demo@lavera.com",
      })
    );
    navigate("/");
  };

  return (
    <>
      <Navbar />
      <section className="auth-page">
        <div className="auth-card">
          <div className="auth-decoration">🦋</div>

          <div className="auth-heading">
            <span>WELCOME BACK TO LAVÉRA</span>
            <h1>Login to Your <em>Glow.</em></h1>
            <p>Your clean beauty ritual continues here.</p>
          </div>

          <form onSubmit={handleLogin}>
            <label>Email Address</label>
            <div className="auth-input">
              <Mail size={18} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <label>Password</label>
            <div className="auth-input">
              <Lock size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="auth-options-row">
              <label className="remember-me-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your registered email (Demo)"); }} className="forgot-password-link">
                Forgot password?
              </a>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit">
              Login to Account <ArrowRight size={17} style={{ display: 'inline', marginLeft: 6 }} />
            </button>

            <button
              type="button"
              className="quick-demo-btn"
              onClick={handleQuickDemo}
            >
              <Sparkles size={15} /> Instant Demo Account Login
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account yet?{" "}
            <Link to="/signup">Create one here ♡</Link>
          </p>

          <Link to="/" className="auth-back">
            ← Back to Home
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Login;
