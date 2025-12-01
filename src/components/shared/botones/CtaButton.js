"use client";

import React from "react";
import Link from "next/link";
import styles from "./CtaButton.module.css";

const toCharSpans = (text = "") =>
  Array.from(text).map((ch, i) => (
    <span
      key={`${ch}-${i}`}
      data-label={ch === " " ? "\u00A0" : ch}
      style={{ "--i": i + 1 }}
    >
      {ch === " " ? "\u00A0" : ch}
    </span>
  ));

export default function CtaButton({
  primaryTop = "",
  primaryBottom = "",
  hoverText = "",
  href = "",
  prefetch = true,
  title = "",
  ariaLabel = "",
  openInNewTab = true,
}) {
  const Comp = href ? Link : "button";
  const interactiveProps = href
    ? {
      href,
      prefetch,
      ...(openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {}),
    }
    : {};

  return (
    <Comp
      className={styles.button}
      title={title}
      aria-label={ariaLabel}
      {...interactiveProps}
    >
      <div className={styles.bg} aria-hidden="true" />

      {/* Splash decorativo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 342 208"
        height="208"
        width="342"
        className={styles.splash}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeWidth="3" d="M54.105 99.784s-14.007-8.997-27.416-2.148C13.28 104.485 1.5 97.636 1.5 97.636" />
        <path strokeLinecap="round" strokeWidth="3" d="M285.273 99.784s14.007-8.996 27.416-2.147C326.098 104.486 340.105 95.489 340.105 95.489" />
        <path strokeLinecap="round" strokeWidth="3" strokeOpacity="0.3" d="M281.133 64.992s6.827-15.183 21.801-16.762c14.974-1.58 16.778-11.703 16.778-11.703" />
        <path strokeLinecap="round" strokeWidth="3" strokeOpacity="0.3" d="M281.133 138.984s6.827 15.183 21.801 16.762c14.974 1.58 16.778 11.703 16.778 11.703" />
        <path strokeLinecap="round" strokeWidth="3" d="M230.578 57.448s-4.793-15.942 5.483-26.947c10.276-11.005 8.625-17.5 8.625-17.5" />
        <path strokeLinecap="round" strokeWidth="3" d="M230.578 150.528s-4.793 15.943 5.483 26.948c10.276 11.005 8.625 17.5 8.625 17.5" />
        <path strokeLinecap="round" strokeWidth="3" strokeOpacity="0.3" d="M170.392 57.028s3.498-14.896-0.821-27.488C165.252 16.948 168.751 2.052 168.751 2.052" />
        <path strokeLinecap="round" strokeWidth="3" strokeOpacity="0.3" d="M170.392 150.948s3.498 14.896-0.821 27.488c-4.319 12.592-0.82 27.488-0.82 27.488" />
        <path strokeLinecap="round" strokeWidth="3" d="M112.609 57.448s4.792-15.943-5.484-26.948C96.849 19.495 98.5 13 98.5 13" />
        <path strokeLinecap="round" strokeWidth="3" d="M112.609 150.528s4.792 15.943-5.484 26.948C96.849 188.481 98.5 194.976 98.5 194.976" />
        <path strokeLinecap="round" strokeWidth="3" strokeOpacity="0.3" d="M62.294 64.992S55.467 49.809 40.493 48.229C25.519 46.65 23.716 36.527 23.716 36.527" />
        <path strokeLinecap="round" strokeWidth="3" strokeOpacity="0.3" d="M62.294 145.984s-6.827 15.183-21.801 16.762C25.519 164.326 23.716 174.449 23.716 174.449" />
      </svg>

      <div className={styles.wrap}>
        {/* Trazo exterior */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 221 42"
          height="42"
          width="221"
          className={styles.path}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeWidth="3"
            d="M182.674 2H203C211.837 2 219 9.163 219 18v6c0 8.837-7.163 16-16 16H18C9.163 40 2 32.837 2 24v-6C2 9.163 9.163 2 18 2h29.886"
          />
        </svg>

        <div className={styles.outline} aria-hidden="true" />

        <div className={styles.content}>
          {/* -------- Normal: izquierda (dos líneas) / derecha (flecha) -------- */}
          <div className={styles.primary} aria-hidden="false">
            <div className={styles.primaryText}>
              <span className={`${styles.char} ${styles["state-1"]}`}>
                {toCharSpans(primaryTop)}
              </span>
              <span className={`${styles.char} ${styles["state-1"]}`}>
                {toCharSpans(primaryBottom)}
              </span>
            </div>

            <div className={`${styles.icon} ${styles.iconRight}`} aria-hidden="true">
              <div />
            </div>
          </div>

          {/* -------- Hover/Focus: ¡Participa! -------- */}
          <span className={styles.secondary} aria-hidden="true">
            {hoverText}
          </span>
        </div>
      </div>
    </Comp>
  );
}
