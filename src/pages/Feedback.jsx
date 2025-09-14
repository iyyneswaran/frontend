// frontend/src/Feedback.jsx
import React, { useState, useEffect } from "react";
import "../styles/Feedback.css"; // adjust to your actual path
// const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
import feedbackimg from '../assets/feedback_img.png';

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Feedback() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const feedbackSection = document.getElementById("feedbackSection");
    if (!feedbackSection) return;
    function createQuestionMark() {
      const question = document.createElement("div");
      question.classList.add("question");
      question.textContent = "?";
      question.style.left = `${Math.random() * 100}%`;
      question.style.fontSize = `${Math.random() * 1 + 1}em`;
      question.style.animationDuration = `${4 + Math.random() * 3}s`;
      feedbackSection.appendChild(question);
      setTimeout(() => {
        if (feedbackSection.contains(question)) {
          feedbackSection.removeChild(question);
        }
      }, 7000);
    }
    const interval = setInterval(createQuestionMark, 400);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);

    const payload = {
      name: fd.get("name") || "",
      email: fd.get("email") || "",
      rating: fd.get("rating") ? Number(fd.get("rating")) : undefined,
      message: fd.get("message") || "",
      product: fd.get("product") || "",
      experience: fd.get("experience") || "",
      support: fd.get("support") || "",
      unresolved: fd.get("unresolved") || "",
      subscribe: fd.get("subscribe") === "on"
    };

    try {
      const res = await fetch(`${API}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to send");
      alert("Thanks for your feedback!");
      form.reset();
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert("Could not submit feedback. Try again.");
    }
  };

  return (
    <>
      <section className="feedback-section" id="feedbackSection">
        <div className="feedback-image fade-in-left">
          <img src={feedbackimg} alt="Feedback Illustration" />
        </div>

        <div className="feedback-left">
          <h2>We Value Your Feedback 💬</h2>
          <p>Help us grow better by sharing your thoughts about our products and services.</p>
          <button onClick={() => setIsOpen(true)}>Give Feedback</button>
        </div>
      </section>

      <div className={`feedback-modal ${isOpen ? "show" : ""}`}>
        <div className="modal-content">
          <span className="close-btn" onClick={() => setIsOpen(false)}>×</span>
          <h2>🌿 We value your feedback!</h2>

          <form id="feedbackForm" onSubmit={handleSubmit}>
            <input type="text" placeholder="Your Name" name="name" />
            <input type="email" placeholder="Email or Phone" name="email" />

            <label className="label">Your Experience:</label>
            <div className="rating">
              <span>😞</span>
              <input type="range" name="rating" min="1" max="5" step="1" />
              <span>😍</span>
            </div>

            <textarea placeholder="What can we improve?" name="message"></textarea>
            <input type="text" placeholder="Product viewed/purchased" name="product" />

            <select name="experience" defaultValue="">
              <option value="" disabled>Shopping experience</option>
              <option>Smooth</option>
              <option>Confusing</option>
              <option>Didn't shop yet</option>
            </select>

            <label className="label">Was your query answered?</label>
            <div className="radio-group">
              <label><input type="radio" name="support" value="yes" /> Yes</label>
              <label><input type="radio" name="support" value="no" /> No</label>
            </div>

            <textarea placeholder="Any unresolved issues?" name="unresolved"></textarea>

            <label className="checkbox">
              <input type="checkbox" name="subscribe" /> Subscribe me to updates/newsletter
            </label>

            <button type="submit">Submit Feedback</button>
          </form>
        </div>
      </div>
    </>
  );
}
