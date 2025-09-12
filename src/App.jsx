// App.jsx
import "./App.css";
import { Routes, Route } from "react-router-dom";
import AboutUs from "./pages/AboutUs";
import Achievements from "./pages/Achievements";
import Carousel from "./pages/Carousel";
import CustomProduct from "./pages/CustomProduct";
import Info from "./pages/Info";
import Marquee from "./pages/Marquee";
import Team from "./pages/Team";
import Feedback from "./pages/Feedback";
import Contact from "./pages/Contact";
import Footer from "./pages/Footer";
import Admin from "./pages/admin/Admin";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Hero from "./pages/Home";
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

function App() {
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const heroSection = document.getElementById("heroSection");

    const handleScroll = () => {
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setShowArrow(window.scrollY > heroBottom - 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Routes>
        {/* Home page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Info />
              <AboutUs />
              <Marquee />
              <Product />
              <CustomProduct />
              <Achievements />
              {/* <Carousel /> */}
              <Team />
              <Feedback />
              <Contact />
              <Footer />
            </>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {/* Scroll To Top Arrow */}
      {showArrow && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <FaArrowUp />
        </button>
      )}
    </>
  );
}

export default App;