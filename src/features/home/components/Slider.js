"use client";

import React, { useState, useEffect } from 'react';
import styles from './Slider.module.css';
import { slidesZMVM as slides } from '@/data/sliderData';

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    let fadeTimeout;
    const interval = setInterval(() => {
      setFade(true);
      fadeTimeout = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setFade(false);
      }, 1000); // duración salida
    }, 12000); // cada 12s
    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimeout);
    };
  }, []);

  return (
    <div className={styles.sliderContainer}>
      <div className={`${styles.slide} ${fade ? styles.isFading : ''}`}>
        <div className={styles.slideImage}>
          <img src={`/${slides[currentSlide].image}`} alt={slides[currentSlide].title} />
        </div>

        <div className={styles.slideContent}>
          <h2 className={styles.slideTitle}>{slides[currentSlide].title}</h2>
          <p className={styles.slideDescription}>{slides[currentSlide].description}</p>
        </div>

        <div className={styles.sliderControls} role="group" aria-label="Seleccionar diapositiva">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.dot} ${currentSlide === index ? styles.active : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir a la diapositiva ${index + 1}`}
              aria-pressed={currentSlide === index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
