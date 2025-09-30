// frontend/src/Product.jsx
import React, { useEffect, useState } from "react";
import "../styles/Product.css";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  useEffect(() => {
    setAnimate(true);
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // reset variant selection whenever modal product changes
    setSelectedVariantIndex(0);
  }, [selectedProduct]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/api/products`);
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const getCardPriceDisplay = (product) => {
    if (product.sizes && product.sizes.length) {
      const min = Math.min(...product.sizes.map((s) => Number(s.price || 0)));
      return `From ₹${Number(min).toLocaleString()}`;
    }
    return `₹${Number(product.price || 0).toLocaleString()}`;
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
              onClick={() => { setSelectedProduct(product); setSelectedVariantIndex(0); }}
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
                  <strong>{getCardPriceDisplay(product)}</strong>
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

            {/* Price display (selected variant or fallback) */}
            <p className="modal-price">
              {selectedProduct.sizes && selectedProduct.sizes.length
                ? `₹${Number((selectedProduct.sizes[selectedVariantIndex] || {}).price || 0).toLocaleString()}`
                : `₹${Number(selectedProduct.price || 0).toLocaleString()}`
              }
            </p>

            <p className="modal-desc">{selectedProduct.description}</p>

            {/* Size/variant selector */}
            <div className="size-selector-wrapper">
              {selectedProduct.sizes && selectedProduct.sizes.length ? (
                <div className="size-selector">
                  {selectedProduct.sizes.map((s, idx) => (
                    <div
                      key={idx}
                      className={`size-box ${selectedVariantIndex === idx ? "active" : ""}`}
                      onClick={() => setSelectedVariantIndex(idx)}
                    >
                      <div className="size-price">₹{Number(s.price || 0).toLocaleString()}</div>
                      <div className="size-label">{s.label}</div>
                      <div className="size-dim">{s.dimension}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="muted" style={{ marginTop: 8 }}>No size variants</div>
              )}
            </div>

            {/* action: just a placeholder - you can wire add-to-cart here */}
            {/* <div style={{ marginTop: 12 }}>
              <button className="add-btn">Add to Cart</button>
              <button className="muted" style={{ marginLeft: 8 }} onClick={() => setSelectedProduct(null)}>Close</button>
            </div> */}
          </div>
        </div>
      )}
    </section>
  );
}
