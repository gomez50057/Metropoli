"use client";

import { useRef, useState } from "react";
import styles from "./IntroVideoSection.module.css";

export default function IntroVideoSection() {
  const videoRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [playbackError, setPlaybackError] = useState("");

  const startVideo = async () => {
    setPlaybackError("");
    try {
      await videoRef.current.play();
      videoRef.current.focus();
    } catch {
      setPlaybackError("No se pudo reproducir el video. Vuelve a intentarlo.");
    }
  };

  return (
    <section className={styles.section} aria-label="Video sobre las zonas metropolitanas">
      <div className={styles.player}>
        <video
          ref={videoRef}
          className={styles.video}
          controls={hasStarted}
          playsInline
          preload="none"
          poster="/img/intro-video-poster.webp"
          tabIndex={0}
          aria-label="Video sobre las zonas metropolitanas"
          onPlay={() => setHasStarted(true)}
          onEnded={() => setHasStarted(false)}
        >
          <source src="/video/tutorial.mp4" type="video/mp4" />
          Tu navegador no soporta la reproducción de videos.
        </video>
        {!hasStarted && (
          <button
            type="button"
            className={styles.cover}
            onClick={startVideo}
            aria-label="Reproducir video sobre las zonas metropolitanas"
          >
            <span className={styles.playButton}>
              <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
                <circle className={styles.ring} cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="35" fill="currentColor" />
                <path d="M43 34 66 50 43 66Z" fill="var(--vinoOsc)" />
              </svg>
            </span>
            <span className={styles.label}>Dale play y conoce más de Metrópoli Hidalgo</span>
          </button>
        )}
      </div>
      {playbackError && <p className={styles.error} role="alert">{playbackError}</p>}
    </section>
  );
}
