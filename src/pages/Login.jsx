
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import "../styles/Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    if (!user) {
      setError("Invalid email or password. Please try again.");
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

  return (
    <section className="auth-page">
      <div className="auth-card">

        <div className="auth-decoration">🦋</div>

        <div className="auth-heading">
          <span>WELCOME BACK TO LAVÉRA</span>
          <h1>Login to Your <em>Glow.</em></h1>
          <p>Your beauty journey continues here.</p>
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
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit">
            Login to Account →
          </button>

        </form>

        <p className="auth-switch">
          Don't have an account?
          <Link to="/signup"> Create Account</Link>
        </p>

        <Link to="/" className="auth-back">
          ← Back to Home
        </Link>

      </div>
    </section>
  );
}

export default Login;
