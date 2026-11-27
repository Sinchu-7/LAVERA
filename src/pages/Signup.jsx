import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  UserRound,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Auth.css";

function calculateStrength(pass) {
  let score = 0;
  if (!pass) return { score: 0, label: "Empty", color: "#ccc" };
  if (pass.length >= 8) score += 1;
  if (pass.length >= 12) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1) return { score: 1, label: "Weak", color: "#ef4444" };
  if (score === 2) return { score: 2, label: "Fair", color: "#f59e0b" };
  if (score === 3) return { score: 3, label: "Good", color: "#10b981" };
  return { score: 4, label: "Strong & Secure", color: "#70469b" };
}

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const strength = calculateStrength(password);

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || name.trim().length < 2) {
      setError("Please enter your full name (at least 2 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must contain both letters and at least one number.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const users = JSON.parse(
      localStorage.getItem("lavera-users") || "[]"
    );

    const existingUser = users.find(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existingUser) {
      setError("This email is already registered. Please login.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    localStorage.setItem(
      "lavera-users",
      JSON.stringify([...users, newUser])
    );

    localStorage.setItem(
      "lavera-current-user",
      JSON.stringify({
        name: newUser.name,
        email: newUser.email,
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
            <span>JOIN THE LAVÉRA FAMILY</span>
            <h1>Create Your <em>Account.</em></h1>
            <p>A little self-care, a lot of confidence.</p>
          </div>

          <form onSubmit={handleSignup}>
            <label>Full Name</label>
            <div className="auth-input">
              <UserRound size={18} />
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <label>Create Password</label>
            <div className="auth-input">
              <Lock size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
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

            {password && (
              <div className="password-strength-meter">
                <div className="strength-bar-track">
                  <div
                    className="strength-bar-fill"
                    style={{
                      width: `${(strength.score / 4) * 100}%`,
                      background: strength.color,
                    }}
                  />
                </div>
                <span className="strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}

            <label>Confirm Password</label>
            <div className="auth-input">
              <Lock size={18} />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit">
              Join LAVÉRA Family <ArrowRight size={17} style={{ display: 'inline', marginLeft: 6 }} />
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Login here ♡</Link>
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

export default Signup;
