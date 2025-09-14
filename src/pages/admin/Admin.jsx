// frontend/src/Admin.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiDeleteBinLine } from "@remixicon/react";
import "../../styles/Admin.css";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("feedback"); // 'feedback' | 'custom' | 'products' | 'users'
  const [feedbacks, setFeedbacks] = useState([]);
  const [customs, setCustoms] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    imageFile: null,
    imageUrl: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [activeTab]);

  const getToken = () => localStorage.getItem("token");

  async function safeJson(res) {
    // try to parse JSON, otherwise return text
    try {
      return await res.json();
    } catch (e) {
      const t = await res.text().catch(() => "");
      return { message: t || res.statusText };
    }
  }

  const loadData = async () => {
    setError("");
    setLoading(true);
    try {
      if (activeTab === "feedback") {
        const res = await fetch(`${API}/api/feedback`);
        if (!res.ok) {
          const err = await safeJson(res);
          throw new Error(err.message || "Failed to fetch feedback");
        }
        const data = await res.json();
        setFeedbacks(Array.isArray(data) ? data : []);
      } else if (activeTab === "custom") {
        const res = await fetch(`${API}/api/custom-products`);
        if (!res.ok) {
          const err = await safeJson(res);
          throw new Error(err.message || "Failed to fetch custom products");
        }
        const data = await res.json();
        setCustoms(Array.isArray(data) ? data : []);
      } else if (activeTab === "products") {
        const res = await fetch(`${API}/api/products`);
        if (!res.ok) {
          const err = await safeJson(res);
          throw new Error(err.message || "Failed to fetch products");
        }
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } else if (activeTab === "users") {
        const token = getToken();
        if (!token) {
          setError("You must be logged in as an admin to view users.");
          setUsers([]);
          setLoading(false);
          return;
        }
        const res = await fetch(`${API}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const err = await safeJson(res);
          throw new Error(err.message || "Failed to fetch users");
        }
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  /* Feedback & Custom delete handlers */
  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      const res = await fetch(`${API}/api/feedback/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleDeleteCustom = async (id) => {
    if (!window.confirm("Delete this custom product request?")) return;
    try {
      const res = await fetch(`${API}/api/custom-products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setCustoms((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* Products (same as earlier with fixes) */
  const openAddProduct = () => {
    setIsEditing(false);
    setEditingId(null);
    setProductForm({ name: "", price: "", description: "", imageFile: null, imageUrl: "" });
    setProductModalOpen(true);
  };

  const openEditProduct = (prod) => {
    setIsEditing(true);
    setEditingId(prod._id);
    setProductForm({
      name: prod.name || "",
      price: prod.price !== undefined ? String(prod.price) : "",
      description: prod.description || "",
      imageFile: null,
      imageUrl: prod.imageUrl || "",
    });
    setProductModalOpen(true);
  };

  const handleProductFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") setProductForm((p) => ({ ...p, imageFile: files[0] || null }));
    else setProductForm((p) => ({ ...p, [name]: value }));
  };

  const getImageSrc = (p) => {
    if (!p?.imageUrl) return "/placeholder-product.png";
    const url = p.imageUrl;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    // ensure no double slash
    return `${API}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("You must be logged in as an admin to add or edit products.");
      }

      const formData = new FormData();
      formData.append("name", productForm.name || "");
      // save price as number if possible
      const priceNumber = productForm.price ? Number(productForm.price) : 0;
      formData.append("price", isNaN(priceNumber) ? 0 : priceNumber);
      formData.append("description", productForm.description || "");

      if (productForm.imageFile) {
        // backend expects field named 'image' for uploaded file
        formData.append("image", productForm.imageFile);
      } else if (productForm.imageUrl) {
        // fallback: external image URL string
        formData.append("imageUrl", productForm.imageUrl);
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        // IMPORTANT: do NOT set 'Content-Type' when sending FormData. Let the browser set it.
      };

      let res;
      if (isEditing && editingId) {
        res = await fetch(`${API}/api/products/${editingId}`, {
          method: "PUT",
          body: formData,
          headers,
        });
      } else {
        res = await fetch(`${API}/api/products`, {
          method: "POST",
          body: formData,
          headers,
        });
      }

      if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(err.message || `Product save failed (status ${res.status})`);
      }

      const saved = await res.json();
      if (isEditing) {
        setProducts((prev) => prev.map((p) => (p._id === saved._id ? saved : p)));
      } else {
        setProducts((prev) => [saved, ...prev]);
      }

      setProductModalOpen(false);
      setProductForm({ name: "", price: "", description: "", imageFile: null, imageUrl: "" });
      setEditingId(null);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not save product. Try again.");
      alert(err.message || "Could not save product. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const token = getToken();
      if (!token) return alert("Not authorized");
      const res = await fetch(`${API}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(err.message || "Delete failed");
      }
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Delete failed");
    }
  };

  /* USERS (admin only) */
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const token = getToken();
      if (!token) return alert("Not authorized");
      const res = await fetch(`${API}/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(err.message || "Delete user failed");
      }
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Delete user failed");
    }
  };

  const toggleAdmin = async (user) => {
    try {
      const token = getToken();
      if (!token) return alert("Not authorized");
      const res = await fetch(`${API}/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isAdmin: !user.isAdmin }),
      });
      if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(err.message || "Update user failed");
      }
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
      alert(`User ${updated.isAdmin ? "granted" : "revoked"} admin access`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not update user");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Welcome back</h1>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.reload();
          }}
        >
          Log Out
        </button>
      </div>

      <div className="admin-tabs">
        <button className={`tab ${activeTab === "feedback" ? "active" : ""}`} onClick={() => setActiveTab("feedback")}>
          Feedback
        </button>
        <button className={`tab ${activeTab === "custom" ? "active" : ""}`} onClick={() => setActiveTab("custom")}>
          Custom Products
        </button>
        <button className={`tab ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>
          Products
        </button>
        <button className={`tab ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
          Users
        </button>
      </div>

      <div className="admin-panel">
        {loading && <div className="muted">Loading...</div>}
        {error && <div className="error">{error}</div>}

        {/* Feedback */}
        {activeTab === "feedback" && !loading && (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name / Email</th>
                  <th>Rating / Experience</th>
                  <th>Message / Product</th>
                  <th>Support</th>
                  <th>Unresolved</th>
                  <th>Subscribe</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.length === 0 && <tr><td colSpan="8" className="muted">No feedbacks yet</td></tr>}
                {feedbacks.map((f, idx) => (
                  <tr key={f._id}>
                    <td>{idx + 1}.</td>
                    <td>
                      <strong>{f.name || "—"}</strong>
                      <div className="muted">{f.email || "—"}</div>
                      <div className="muted">{new Date(f.createdAt).toLocaleString()}</div>
                    </td>
                    <td>{f.rating ? `${f.rating}/5` : "—"}<div className="muted">{f.experience || ""}</div></td>
                    <td><div>{f.message || "—"}</div><div className="muted">Product: {f.product || "—"}</div></td>
                    <td>{f.support || "—"}</td>
                    <td>{f.unresolved || "—"}</td>
                    <td>{f.subscribe ? "Yes" : "No"}</td>
                    <td><button className="delete-btn" onClick={() => handleDeleteFeedback(f._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Custom */}
        {activeTab === "custom" && !loading && (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>Id</th><th>Name / Contact</th><th>Size</th><th>Quantity</th><th>Details</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {customs.length === 0 && <tr><td colSpan="6" className="muted">No requests yet</td></tr>}
                {customs.map((c, idx) => (
                  <tr key={c._id}>
                    <td>{idx + 1}.</td>
                    <td>
                      <strong>{c.name}</strong>
                      <div className="muted">{c.contact}</div>
                      <div className="muted">{new Date(c.createdAt).toLocaleString()}</div>
                    </td>
                    <td>{c.size || "—"}</td>
                    <td>{c.quantity || "—"}</td>
                    <td>{c.details || "—"}</td>
                    <td><button className="delete-btn" onClick={() => handleDeleteCustom(c._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Products */}
        {activeTab === "products" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3>Existing products</h3>
              <button className="add-btn" onClick={openAddProduct}>Add products</button>
            </div>
            <div className="product-grid-admin">
              {products.length === 0 && <div className="muted">No products yet — add one.</div>}
              {products.map((p) => (
                <div className="admin-product-card" key={p._id}>
                  <div className="admin-product-img-wrap">
                    <img src={getImageSrc(p)} alt={p.name} className="admin-product-img" />
                  </div>
                  <div className="admin-product-body">
                    <h4>{p.name}</h4>
                    <p className="muted">{p.description}</p>
                    <div className="admin-product-footer">
                      <button className="delete-btn" onClick={() => handleDeleteProduct(p._id)}><RiDeleteBinLine className="delete-icon"/></button>
                      <button className="update-btn" onClick={() => openEditProduct(p)}>Update</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Users (admin only) */}
        {activeTab === "users" && !loading && (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Name / Email</th><th>Is Admin</th><th>Created</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.length === 0 && <tr><td colSpan="5" className="muted">No users found</td></tr>}
                {users.map((u, idx) => (
                  <tr key={u._id}>
                    <td>{idx + 1}.</td>
                    <td><strong>{u.name || "—"}</strong><div className="muted">{u.email}</div></td>
                    <td>{u.isAdmin ? "Yes" : "No"}</td>
                    <td className="muted">{new Date(u.createdAt).toLocaleString()}</td>
                    <td className="btn-container">
                      <button className="update-btn" onClick={() => toggleAdmin(u)}>{u.isAdmin ? "Revoke" : "Make Admin"}</button>
                      <button className="delete-btn" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* product modal */}
      {productModalOpen && (
        <div className="modal-overlay" onClick={() => setProductModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setProductModalOpen(false)}>&times;</button>
            <h3>{isEditing ? "Edit product" : "Add product"}</h3>
            <form onSubmit={submitProduct} className="product-form">
              <input name="name" placeholder="Product name" value={productForm.name} onChange={handleProductFormChange} required />
              <input name="price" placeholder="Price (number)" value={productForm.price} onChange={handleProductFormChange} />
              <textarea name="description" placeholder="Description" value={productForm.description} onChange={handleProductFormChange} />
              <label className="">Image: upload a file (preferred) or paste external image URL below</label>
              <input type="file" accept="image/*" name="imageFile" onChange={handleProductFormChange} />
              <input name="imageUrl" placeholder="Image URL (optional)" value={productForm.imageUrl} onChange={handleProductFormChange} />
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" className="add-btn" disabled={loading}>{loading ? "Saving..." : (isEditing ? "Save" : "Create")}</button>
                <button type="button" className="muted" onClick={() => setProductModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
