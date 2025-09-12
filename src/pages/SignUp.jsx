// frontend/src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [registerAsAdmin, setRegisterAsAdmin] = useState(false);
  const [adminSecret, setAdminSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: formData.name, email: formData.email, password: formData.password };
      if (registerAsAdmin) payload.adminSecret = adminSecret;

      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Registration successful! Please log in.");
        navigate("/login");
      } else {
        alert(data.message || "❌ Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create Account</h2>

        <form onSubmit={handleSubmit} className="signup-form">
          <div>
            <label className="signup-label">Name</label>
            <input type="text" name="name" required placeholder="Your Name" value={formData.name} onChange={handleChange} className="signup-input" />
          </div>

          <div>
            <label className="signup-label">Email</label>
            <input type="email" name="email" required placeholder="you@example.com" value={formData.email} onChange={handleChange} className="signup-input" />
          </div>

          <div>
            <label className="signup-label">Password</label>
            <input type="password" name="password" required placeholder="Create a password" value={formData.password} onChange={handleChange} className="signup-input" />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <input type="checkbox" checked={registerAsAdmin} onChange={(e) => setRegisterAsAdmin(e.target.checked)} />
            Register as admin (requires admin secret)
          </label>

          {registerAsAdmin && (
            <div>
              <label className="signup-label">Admin Secret</label>
              <input type="text" value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} placeholder="Enter admin secret" className="signup-input" />
            </div>
          )}

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="signup-footer">
          Already have an account? <a href="/login" className="signup-link">Log In</a>
        </p>
      </div>
    </div>
  );
}
