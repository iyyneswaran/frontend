import React, { useEffect } from "react";
import "../styles/Achievements.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dst from '../assets/DST-NIDHI-logo.webp';
import aicte from '../assets/AICTE.webp';
import cboi from '../assets/Coir_Board_of_India.jpg';
import startup from '../assets/startup.webp';

gsap.registerPlugin(ScrollTrigger);

export default function Achievements() {
  useEffect(() => {
    gsap.utils.toArray(".card").forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <section id="achievementSection" className="achievements-section-bg">
      <div className="achievements-section">
        {/* Header */}
        <div className="achievements-cards-header">
          <button>Our achievements</button>
          <h2>
            Achievements by our <br /> <span>ECOPULS</span>
          </h2>
        </div>

        {/* Achievement Cards */}
        <div className="achievements-section">
          <div className="card">
            <div className="card-right">
              <img src={dst} alt="DST NIDHI logo" />
            </div>
            <div className="card-center">
              <h2>
                6+ Lakh Grant <span>Nidhi Prayas (SSIIE–TBI, Tirupati)</span>
              </h2>
              <p>
                Received ₹6+ lakhs as a grant under NIDHI PRAYAS (SSIIE–TBI,
                Tirupati) for innovative product development, marking a major
                milestone in our entrepreneurial journey.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-center">
              <h2>
                Best Performing Startup – AICTE & MoE<span>@ GITAM</span>
              </h2>
              <p>
                Recognized as the Best Performing Startup in Innovation,
                Design, and Entrepreneurship by AICTE & Ministry of Education’s
                Innovation Cell.
              </p>
            </div>
            <div className="card-left">
              <img src={aicte} alt="AICTE logo" />
            </div>
          </div>

          <div className="card">
            <div className="card-right">
              <img
                src={cboi}
                alt="Coir Board logo"
              />
            </div>
            <div className="card-center">
              <h2>
                Coir Board of India{" "}
                <span>coconut-based product development</span>
              </h2>
              <p>
                Successfully trained and certified by the Coir Board of India in
                coconut-based product development, enhancing our expertise in
                sustainable innovation and eco-friendly manufacturing
                solutions.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-center">
              <h2>
                Startup Mahakumbh <span>@ 2024</span>
              </h2>
              <p>
                Participated in Startup Mahakumbh during 2024 and 2025,
                showcasing our innovations on a national platform and networking
                with top investors, mentors, and fellow entrepreneurs.
              </p>
            </div>
            <div className="card-left">
              <img src={startup} alt="Startup Mahakumbh logo" />
            </div>
          </div>

          <div className="card">
            <div className="card-left">
              <img src={startup} alt="Startup Mahakumbh logo" />
            </div>
            <div className="card-center">
              <h2>
                Startup Mahakumbh <span>@ 2025</span>
              </h2>
              <p>
                Participated in Startup Mahakumbh during 2024 and 2025,
                showcasing our innovations on a national platform and networking
                with top investors, mentors, and fellow entrepreneurs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};