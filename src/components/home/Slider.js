"use client";

import React, { useState, useEffect } from 'react';
import styles from './Slider.module.css';
import { slidesZMVM, slidesOther } from '@/utils/sliderData';

const Slider = () => {
  const [zonaSeleccionada, setZonaSeleccionada] = useState('');
  const [slides, setSlides] = useState(slidesZMVM);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const getZonaFromLocalStorage = () => {
      const zonaMetropolitana = localStorage.getItem('selectedZonaMetropolitana');
      setZonaSeleccionada(zonaMetropolitana || '');
    };
    getZonaFromLocalStorage();
    window.addEventListener('zonaChanged', getZonaFromLocalStorage);
    return () => window.removeEventListener('zonaChanged', getZonaFromLocalStorage);
  }, []);

  useEffect(() => {
    setSlides(zonaSeleccionada === 'ZMVM' ? slidesZMVM : slidesOther);
    setCurrentSlide(0);
  }, [zonaSeleccionada]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      const t = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setFade(false);
      }, 1000); // duración salida
      return () => clearTimeout(t);
    }, 12000); // cada 12s
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <div className={styles.sliderContainer}>
      <div className={`${styles.slide} ${fade ? styles.isFading : ''}`}>
        <div className={styles.slideImage}>
          <img src={slides[currentSlide].image} alt="slide" />
        </div>

        <div className={styles.slideContent}>
          <h2 className={styles.slideTitle}>{slides[currentSlide].title}</h2>
          <p className={styles.slideDescription}>{slides[currentSlide].description}</p>
        </div>

        <div className={styles.sliderControls} role="tablist" aria-label="Seleccionar diapositiva">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.dot} ${currentSlide === index ? styles.active : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir a la diapositiva ${index + 1}`}
              aria-selected={currentSlide === index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
