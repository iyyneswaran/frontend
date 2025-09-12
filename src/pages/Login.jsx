// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const doLogin = async (adminAttempt = false) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      if (adminAttempt && !data.user?.isAdmin) {
        alert("This account is not an admin. Use User Login or register as admin.");
        return;
      }

      // ✅ Save credentials
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("✅ Logged in successfully!");

      // ✅ Redirect
      if (adminAttempt) navigate("/admin");
      else navigate("/");
    } catch (err) {
      console.error("Login Error:", err);
      alert("Server error, try again later");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    doLogin(false); // default user login
  };

  return (
    <div className="login-page">
      <div className="login-card" role="main" aria-labelledby="login-heading">
        <h2 id="login-heading" className="login-title">Log In</h2>
        <p className="login-sub">Welcome Back to Ecopuls</p>

        <form id="loginForm" className="login-form" onSubmit={handleSubmit}>
          <label className="label">
            <span className="label-text">Email</span>
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="input"
            />
          </label>

          <label className="label">
            <span className="label-text">Password</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="input"
            />
          </label>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              type="button"
              className="submit-btn"
              onClick={() => doLogin(false)}
              disabled={loading}
            >
              {loading ? "Please wait..." : "User Login"}
            </button>
            <button
              type="button"
              className="submit-btn"
              onClick={() => doLogin(true)}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Admin Login"}
            </button>
          </div>
        </form>

        <div className="divider"><span>Or</span></div>

        <p className="signup-text">
          Create a New Account?{" "}
          <a className="signup-link" href="/register">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
