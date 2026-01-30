"use client";

import styles from "./FeaturedPosts.module.css";
import Link from "next/link";
import { useMemo, useState } from "react";
import { normalizeName } from "@/utils/blogData";
import SafeImage from "./shared/SafeImage";

const DEFAULT_VISIBLE = 5;

const FeaturedPosts = ({ featuredPosts = [] }) => {
  const [expanded, setExpanded] = useState(false);

  const items = useMemo(() => featuredPosts ?? [], [featuredPosts]);
  if (!items.length) return null;

  const visiblePosts = expanded ? items : items.slice(0, DEFAULT_VISIBLE);
  const canToggle = items.length > DEFAULT_VISIBLE;

  return (
    <aside className={styles.featuredSection} aria-labelledby="featured-title">
      <h3 id="featured-title" className={styles.featuredTitle}>
        Publicación destacada
      </h3>

      <ul className={styles.featuredList}>
        {visiblePosts.map((post) => (
          <li key={normalizeName(post.name)} className={styles.featuredItem}>
            <SafeImage
              src={post.image}
              alt={post.name || "Imagen de la publicación"}
              className={styles.featuredImage}
              loading="lazy"
              decoding="async"
              fallbackSrc="/img/noticias/fallback.webp"
            />

            <div className={styles.featuredContent}>
              <p className={styles.featuredDate}>{post.date}</p>

              <Link
                href={`/noticias/${normalizeName(post.name)}`}
                className={styles.featuredLink}
              >
                {post.name}
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {canToggle && (
        <div className={styles.toggleWrap}>
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls="featured-list"
          >
            {expanded ? "Ver menos publicaciones" : `Ver más (${items.length - DEFAULT_VISIBLE})`}
            <span className={styles.toggleIcon} aria-hidden="true">
              {expanded ? "▲" : "▼"}
            </span>
          </button>

          {!expanded && (
            <p className={styles.toggleHint}>
              Mostrando {Math.min(DEFAULT_VISIBLE, items.length)} de {items.length}
            </p>
          )}
        </div>
      )}
    </aside>
  );
};

export default FeaturedPosts;
