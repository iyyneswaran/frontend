import React, { useEffect } from "react";
import { gsap } from "gsap";
import "../styles/Team.css";
import team1 from '../assets/team_member_1.webp';
import team2 from '../assets/team_member_2.webp';
import team3 from '../assets/team_member_3.webp';

export default function Team() {
  useEffect(() => {
    gsap.to(".our-team-cards > div", {
      y: -10,
      duration: 2.5,
      ease: "easeInOut",
      yoyo: true,
      repeat: -1,
      stagger: {
        each: 0.4,
        yoyo: true,
        repeat: -1,
      },
    });
  }, []);

  const teamMembers = [
    {
      img: team1,
      name: "Bommisetty Yathin Sai",
      role: "CO-FOUNDER & COO",
      pdf: "/pdfs/Bommisetty_Yathin_Sai.pdf",
    },
    {
      img: team2,
      name: "Budharaju Vinay",
      role: "FOUNDER & CEO",
      pdf: "/pdfs/Budharaju_Vinay.pdf",
    },
    {
      img: team3,
      name: "Sarvesh Raj M",
      role: "CO-FOUNDER & CMO",
      pdf: "/pdfs/Sarvesh_Raj.pdf",
    },
  ];

  return (
    <section className="team-section">
      <h3>Our Team</h3>
      <div className="our-team-cards">
        {teamMembers.map((member, index) => (
          <div className="team-card" key={index}>
            <img src={member.img} alt={member.name} />
            <h4>{member.name}</h4>
            <p>{member.role}</p>
            <a href={member.pdf} download className="download-btn">
              Contact Info
            </a>
          </div>
        ))}
      </div>
      <hr className="line"></hr>
    </section>
  );
};