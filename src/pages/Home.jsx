// frontend/src/pages/Hero.jsx
import React, { useEffect, useState } from "react";
import "../styles/Hero.css";
import logo from "/ecopuls_startup_logo.jpg";
import heroBanner from "../assets/hero_banner.png";
import Typed from "typed.js";
import "remixicon/fonts/remixicon.css";
import { Link, useNavigate } from "react-router-dom";

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Typed.js
  useEffect(() => {
    const typed = new Typed("#typed-text", {
      strings: ["Direct to the Farm", "Eco-Friendly Coir Products", "Sustainable Future"],
      typeSpeed: 80,
      backSpeed: 40,
      backDelay: 1500,
      startDelay: 500,
      loop: true,
      showCursor: true,
      cursorChar: "|",
      smartBackspace: true,
    });

    return () => {
      try {
        typed.destroy();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  // Read user from localStorage on mount and listen for changes (other tabs)
  useEffect(() => {
    const readUserFromStorage = () => {
      try {
        const raw = localStorage.getItem("user");
        const parsed = raw ? JSON.parse(raw) : null;
        setUser(parsed);
      } catch (err) {
        setUser(null);
      }
    };

    readUserFromStorage();

    const onStorage = (e) => {
      if (e.key === "user" || e.key === "token") {
        readUserFromStorage();
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    closeMenu();
    // navigate to home; optional reload if you prefer full refresh
    navigate("/");
  };

  return (
    <div
      className="hero-wrapper"
      style={{ backgroundImage: `url(${heroBanner})` }}
      data-aos="zoom-in"
      data-aos-duration="800"
    >
      {/* Navbar */}
      <nav className="navbar fade-in">
        <div className="nav-left">
          <Link to="/" className="logo" onClick={closeMenu}>
            <img src={logo} alt="ECOPULS Logo" className="logo-image" />
            <span>Ecopuls Green private limited</span>
          </Link>

          {/* Hamburger (mobile) */}
          <div
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={toggleMenu}
            role="button"
            aria-label="Toggle navigation"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter") toggleMenu(); }}
          >
            ☰
          </div>
        </div>

        <div className={`nav-links ${menuOpen ? "active" : ""}`} id="navLinks">
          <a href="#heroSection" onClick={closeMenu}>HOME</a>
          <a href="#aboutUsSection" onClick={closeMenu}>ABOUT US</a>
          <a href="#productSection" onClick={closeMenu}>PRODUCT</a>
          <a href="#achievementSection" onClick={closeMenu}>ACHIEVEMENTS</a>
          <a href="#contactUsSection" onClick={closeMenu}>CONTACT US</a>

          {/* Mobile login/logout */}
          <div className="mobile-login-logout mobile-only">
            {user ? (
              <div id="logoutBtnMobile">
                <button
                  className="login-btn"
                  onClick={() => {
                    logout();
                  }}
                >
                  Logout <i className="ri-arrow-right-up-line"></i>
                </button>
              </div>
            ) : (
              <Link to="/login" id="loginBtnMobile" onClick={closeMenu}>
                <button className="login-btn">
                  Login <i className="ri-arrow-right-up-line"></i>
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Desktop login/logout */}
        <div className="nav-right" id="navRight">
          <div className="call">
            <p>Call us Now</p>
            <span>+91 6301251669</span>
          </div>

          {user ? (
            <button
              className="login-btn"
              onClick={() => {
                logout();
              }}
            >
              Logout <i className="ri-arrow-right-up-line"></i>
            </button>
          ) : (
            <Link to="/login" id="loginBtn">
              <button className="login-btn">
                Login <i className="ri-arrow-right-up-line"></i>
              </button>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="heroSection" className="hero">
        <div className="hero-content" data-aos="fade-right" data-aos-duration="1000">
          <p className="tag">BELIEVE IN QUALITY</p>
          <h1>
            Quality Trust:
            <br />
            <span id="typed-text" className="typing-text" />
          </h1>
          <p className="subtext">Presenting India’s First-Ever Coir Gunny Bags</p>
          <a href="#contactUsSection">
            <button className="contact-btn">
              Contact Us <i className="ri-arrow-right-up-line"></i>
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}
