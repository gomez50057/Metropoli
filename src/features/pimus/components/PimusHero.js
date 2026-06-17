"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./PimusHero.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function PimusHero() {
  const heroRef = useRef(null);
  const homeHeroTopRef = useRef(null);
  const homeHeroBottomRef = useRef(null);
  const svgRef = useRef(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (!heroRef.current || !homeHeroTopRef.current || !homeHeroBottomRef.current) return;

    const ctx = gsap.context(() => {
      const introTl = gsap.timeline();

      introTl
        .from(heroRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        })
        .from(
          svgRef.current,
          {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.2"
        )
        .from(
          homeHeroBottomRef.current,
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
        .to(
          homeHeroTopRef.current,
          {
            marginTop: "-35vh",
            ease: "none",
          },
          0
        )
        // El bloque oscuro sube un poco (parallax suave)
        .fromTo(
          homeHeroBottomRef.current,
          { marginTop: "10vh" },
          { marginTop: "0vh", ease: "none" },
          0
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.bgVideoWrap}>
        <article
          className={`${styles.bgVideo} ${styles.wBackgroundVideo} w-background-video-atom`}
          data-poster-url="/img/PIMUS_ZMP/hero-pimus.png"
          data-autoplay="true"
          data-loop="true"
          data-wf-ignore="true"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            data-wf-ignore="true"
            data-object-fit="cover"
            style={{
              backgroundImage:
                "url('/img/PIMUS_ZMP/hero-pimus.png')",
            }}
          >
            <source
              data-wf-ignore="true"
              src="/video/hero-pimus.mp4"
            />
          </video>
        </article>
      </div>

      <main className="main-wrapper">
        <header className={styles.sectionHomeHero} ref={heroRef}>
          <div className={styles.homeHeroTop} ref={homeHeroTopRef}>
            <div className={`${styles.homeHeroSvgBg} ${styles.themeLight}`}>
              <div className="home-hero_svg-wrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 600 120"
                  className={styles.heroSvg}
                  role="img"
                  aria-labelledby="pimusZmpTitle"
                  ref={svgRef}
                >
                  <title id="pimusZmpTitle">PIMUS ZMP</title>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{
                      fontWeight: 800,
                      fontSize: "70px",
                      letterSpacing: "0.28em",
                    }}
                    fill="currentColor"
                  >
                    PIMUS ZMP
                  </text>
                </svg>
              </div>
            </div>
            <div className={styles.heroBackgroundBlur} />
          </div>

          <div
            className={`${styles.homeHero} ${styles.themeDark}`}
            ref={homeHeroBottomRef}
          >
            <div className={styles.paddingGlobal}>
              <div
                className={`${styles.containerFull} ${styles.paddingSectionSmall}`}
              >
                <div className={styles.homeHeroTextWrap}>
                  <div className={styles.headerWrap}>
                    <div className={styles.eyebrowWrap}>
                      <div>Plan Integral de Movilidad Urbana Sustentable</div>
                    </div>
                    <h4 className={styles.headingStyleH4}>
                      de la Zona Metropolitana de Pachuca
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </main>
    </div>
  );
}
