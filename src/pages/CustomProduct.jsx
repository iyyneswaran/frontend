// frontend/src/CustomProduct.jsx
import React, { useState } from "react";
import "../styles/CustomProduct.css"; 
// const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CustomProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    size: "",
    quantity: "",
    details: ""
  });

  const openCustomModal = () => setIsModalOpen(true);
  const closeCustomModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/custom-products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Network error");
      alert("Custom request submitted! We'll contact you soon.");
      setFormData({ name: "", contact: "", size: "", quantity: "", details: "" });
      closeCustomModal();
    } catch (err) {
      console.error(err);
      alert("Could not send request. Try again.");
    }
  };

  return (
    <>
      <section className="custom-product-section" id="customProductSection">
        <div className="custom-product-left" data-aos="fade-right" data-aos-duration="1000">
          <h2>Need Something Unique? 🎯</h2>
          <p>Tell us your custom requirements — we’re happy to craft it for you!</p>
          <button onClick={openCustomModal}>Request Custom Product</button>
        </div>
      </section>

      {isModalOpen && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <span className="close-btn" onClick={closeCustomModal}>×</span>
            <h2>🎨 Customize Your Product</h2>
            <form id="customProductForm" onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
              <input type="text" name="contact" placeholder="Email or Phone" value={formData.contact} onChange={handleChange} required />
              <input type="text" name="size" placeholder="Size (e.g. Medium)" value={formData.size} onChange={handleChange} />
              <input type="text" name="quantity" placeholder="Quantity (e.g. 5 pieces)" value={formData.quantity} onChange={handleChange} />
              <textarea name="details" placeholder="More details about customization" value={formData.details} onChange={handleChange} />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

    </>
  );
};

export default CustomProduct;
