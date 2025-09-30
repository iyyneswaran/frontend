// frontend/src/Admin.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiDeleteBinLine } from "@remixicon/react";
import "../../styles/Admin.css";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("feedback");
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
    sizes: [] // NEW - array of { label, price, dimension }
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [activeTab]);

  const getToken = () => localStorage.getItem("token");

  async function safeJson(res) {
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

  /* Feedback & Custom delete handlers (unchanged) */
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

  /* Products (with variant editor) */
  const openAddProduct = () => {
    setIsEditing(false);
    setEditingId(null);
    setProductForm({
      name: "",
      price: "",
      description: "",
      imageFile: null,
      imageUrl: "",
      sizes: []
    });
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
      sizes: Array.isArray(prod.sizes)
        ? prod.sizes.map((s) => ({
            label: s.label || "",
            price: s.price !== undefined ? String(s.price) : "",
            dimension: s.dimension || ""
          }))
        : []
    });
    setProductModalOpen(true);
  };

  const handleProductFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") setProductForm((p) => ({ ...p, imageFile: files[0] || null }));
    else setProductForm((p) => ({ ...p, [name]: value }));
  };

  // Variant handlers
  const addVariant = () =>
    setProductForm((p) => ({
      ...p,
      sizes: [...(p.sizes || []), { label: "", price: "", dimension: "" }]
    }));

  const removeVariant = (idx) =>
    setProductForm((p) => ({ ...p, sizes: p.sizes.filter((_, i) => i !== idx) }));

  const handleVariantChange = (idx, field, value) =>
    setProductForm((p) => {
      const sizes = [...(p.sizes || [])];
      sizes[idx] = { ...(sizes[idx] || {}), [field]: value };
      return { ...p, sizes };
    });

  const getImageSrc = (p) => {
    if (!p?.imageUrl) return "/placeholder-product.png";
    const url = p.imageUrl;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
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
      const priceNumber = productForm.price ? Number(productForm.price) : 0;
      formData.append("price", isNaN(priceNumber) ? 0 : priceNumber);
      formData.append("description", productForm.description || "");

      if (productForm.imageFile) {
        formData.append("image", productForm.imageFile); // backend expects 'image'
      } else if (productForm.imageUrl) {
        formData.append("imageUrl", productForm.imageUrl);
      }

      // Attach sizes as JSON string if any
      if (productForm.sizes && productForm.sizes.length) {
        const sizesClean = productForm.sizes.map((s) => ({
          label: s.label || "",
          price: Number(s.price || 0),
          dimension: s.dimension || ""
        }));
        formData.append("sizes", JSON.stringify(sizesClean));
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type when sending formData
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
      setProductForm({ name: "", price: "", description: "", imageFile: null, imageUrl: "", sizes: [] });
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

  /* USERS (unchanged handlers omitted for brevity) */
  const handleDeleteUser = async (id) => { /* same as before */ };
  const toggleAdmin = async (user) => { /* same as before */ };

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

        {/* Feedback & Custom -> same as before (omitted for brevity) */}

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

        {/* Users (omitted for brevity) */}
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

              <label>Sizes / Variants (optional)</label>
              <div className="variants-editor">
                {(productForm.sizes || []).map((v, idx) => (
                  <div className="variant-row" key={idx}>
                    <input
                      placeholder="Label (e.g. 4 inch)"
                      value={v.label}
                      onChange={(e) => handleVariantChange(idx, "label", e.target.value)}
                    />
                    <input
                      placeholder="Price"
                      value={v.price}
                      onChange={(e) => handleVariantChange(idx, "price", e.target.value)}
                    />
                    <input
                      placeholder="Dimension (e.g. 8*11.5 cm)"
                      value={v.dimension}
                      onChange={(e) => handleVariantChange(idx, "dimension", e.target.value)}
                    />
                    <button type="button" className="muted" onClick={() => removeVariant(idx)}>Remove</button>
                  </div>
                ))}
                <div style={{ marginTop: 8 }}>
                  <button type="button" className="add-btn" onClick={addVariant}>Add variant</button>
                </div>
              </div>

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
