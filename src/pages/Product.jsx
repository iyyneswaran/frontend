// frontend/src/Product.jsx
import React, { useEffect, useState } from "react";
import "../styles/Product.css";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/api/products`);
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      // optionally fallback to a static set here
    }
  };

  return (
    <section id="productSection" className="product-section-bg">
      <div className="product-cards-section">
        <div className="product-cards-header">
          <button>Our Products</button>
          <h2>Best Selling Products</h2>
        </div>

        <div className="product-card-grid">
          {products.map((product, index) => (
            <div
              key={product._id}
              className={`feature-card product-card ${
                animate
                  ? index === 0
                    ? "fadeInLeft"
                    : index === 1
                    ? "fadeInDown"
                    : index === 2
                    ? "fadeInUp"
                    : "fadeInRight"
                  : ""
              }`}
              onClick={() => setSelectedProduct(product)}
            >
              <div>
                <img
                  src={
                    product.imageUrl
                      ? `${API}${product.imageUrl}`
                      : "/placeholder-product.png"
                  }
                  alt={product.name}
                  className={`product-card-img ${product.name === "Gunny Bag" ? "gunny_bag" : ""}`}
                />
              </div>
              <hr />
              <div className="cost">
                <h3>{product.name}</h3>
                <span>
                  <strong>₹{Number(product.price).toLocaleString()}</strong>
                </span>
              </div>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>&times;</button>
            <img src={selectedProduct.imageUrl ? `${API}${selectedProduct.imageUrl}` : "/placeholder-product.png"} alt={selectedProduct.name} className="modal-img" />
            <h2>{selectedProduct.name}</h2>
            <p className="modal-price">₹{Number(selectedProduct.price).toLocaleString()}</p>
            <p className="modal-desc">{selectedProduct.description}</p>
          </div>
        </div>
      )}
    </section>
  );
}
