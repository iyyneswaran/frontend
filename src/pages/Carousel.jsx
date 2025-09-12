import React, { useEffect, useRef, useState } from "react";
import "../styles/Carousel.css";
import carousel1 from '../assets/carousel_1.webp';
import carousel2 from '../assets/carousel_2.webp';
import carousel3 from '../assets/carousel_3.webp';
import carousel4 from '../assets/carousel_4.webp';
import carousel5 from '../assets/carousel_5.jpg';

export default function Carousel() {
    const trackRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const slides = [
        carousel1,
        carousel2,
        carousel3,
        carousel4,
        carousel5,
    ];

    const updateSlidePosition = () => {
        const track = trackRef.current;
        if (track) {
            const slideWidth = track.children[0].getBoundingClientRect().width;
            track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
        }
    };

    // Handle auto-slide
    useEffect(() => {
        const interval = setInterval(() => {
            if (document.hasFocus()) {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [slides.length]);

    // Update slide position on index change
    useEffect(() => {
        updateSlidePosition();
    }, [currentIndex]);

    // Update on resize
    useEffect(() => {
        window.addEventListener("resize", updateSlidePosition);
        return () => window.removeEventListener("resize", updateSlidePosition);
    }, []);

    // Swipe support
    useEffect(() => {
        const carousel = trackRef.current?.parentElement;
        let startX = 0;
        let isSwiping = false;

        const handleTouchStart = (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
        };

        const handleTouchMove = (e) => {
            if (!isSwiping) return;
            const moveX = e.touches[0].clientX;
            const diffX = moveX - startX;

            if (Math.abs(diffX) > 50) {
                if (diffX < 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                isSwiping = false;
            }
        };

        const handleTouchEnd = () => {
            isSwiping = false;
        };

        carousel.addEventListener("touchstart", handleTouchStart);
        carousel.addEventListener("touchmove", handleTouchMove);
        carousel.addEventListener("touchend", handleTouchEnd);

        return () => {
            carousel.removeEventListener("touchstart", handleTouchStart);
            carousel.removeEventListener("touchmove", handleTouchMove);
            carousel.removeEventListener("touchend", handleTouchEnd);
        };
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    return (
        <>
            <div className="carousel-container" id="carousel">
                <div className="carousel-track" ref={trackRef}>
                    {slides.map((src, index) => (
                        <div className="carousel-slide" key={index}>
                            <img src={src} alt={`Slide ${index + 1}`} />
                        </div>
                    ))}
                </div>

                {/* Arrows */}
                <button className="arrow prev" onClick={prevSlide}>
                    &#10094;
                </button>
                <button className="arrow next" onClick={nextSlide}>
                    &#10095;
                </button>

                {/* Dots */}
                <div className="dots">
                    {slides.map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${index === currentIndex ? "active" : ""}`}
                            onClick={() => setCurrentIndex(index)}
                        ></span>
                    ))}
                </div>

            </div>

            <hr className="hr-carousel"></hr>
        </>
    );
};