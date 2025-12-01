"use client";
import React, { useState, useMemo } from "react";
import styles from "./BlogNoticias.module.css";
import FeaturedPosts from "./FeaturedPosts";
import Link from "next/link";
import { normalizeName, renderDescription } from "../../utils/blogData";

const MAX_LENGTH = 50;

/* ========= Helpers ========= */
// Normaliza URL de imagen (acepta rutas con espacios/acentos o ya codificadas)
const safeUrl = (path) => {
  if (!path || typeof path !== "string") return "/img/noticias/fallback.webp";
  try {
    return encodeURI(decodeURI(path));
  } catch {
    return encodeURI(path);
  }
};

// Slug consistente para categorías: quita acentos, separa camelCase, minúsculas y guiones
const toSlug = (s = "") =>
  String(s)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")         
    .replace(/([a-z])([A-Z])/g, "$1-$2")                    
    .replace(/[^\w\s-]/g, "")                              
    .trim()
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

const CATEGORY_LABEL_OVERRIDES = {
  imagenurbana: "Imagen Urbana",
  zmvm: "ZMVM",
};
const toLabel = (raw = "") => {
  const slug = toSlug(raw);
  if (CATEGORY_LABEL_OVERRIDES[slug]) return CATEGORY_LABEL_OVERRIDES[slug];
  const spaced = String(raw)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ");
  // Title Case simple
  return spaced.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1).toLowerCase());
};

const BlogNoticias = ({ posts = [], featuredPosts = [] }) => {
  // Construir opciones de categoría a partir de los posts
  const categoryOptions = useMemo(() => {
    const map = new Map();
    for (const p of posts) {
      if (!p?.category) continue;
      const value = toSlug(p.category);
      if (!value) continue;
      if (!map.has(value)) map.set(value, toLabel(p.category));
    }
    return [{ value: "todas", label: "Todas" }, ...[...map].map(([value, label]) => ({ value, label }))];
  }, [posts]);

  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [fadeEffect, setFadeEffect] = useState(false);

  const handleCategoryChange = (e) => {
    const next = e.target.value;
    setFadeEffect(true);
    setTimeout(() => {
      setSelectedCategory(next);
      setFadeEffect(false);
    }, 300);
  };

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "todas") return posts;
    return posts.filter((p) => toSlug(p.category) === selectedCategory);
  }, [posts, selectedCategory]);

  return (
    <section className={styles.blogNoticias}>
      <div className={styles.newsSection}>
        <div className={styles.newsHeader}>
          <h2>
            <span>Noticias</span> de las <span>Zonas</span>{" "}
            <span className="span-doarado">Metropolitanas</span>
          </h2>

          <select
            className={styles.orderSelect}
            onChange={handleCategoryChange}
            value={selectedCategory}
            aria-label="Filtrar por categoría"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={`${styles.newsGrid} ${fadeEffect ? styles.fadeOut : styles.fadeIn}`}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={normalizeName(post.name)} className={styles.newsItem}>
                <img
                  src={safeUrl(post.image)}
                  alt={post.name}
                  className={styles.newsImage}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { e.currentTarget.src = "/img/noticias/fallback.webp"; }}
                />
                <div className={styles.newsContent}>
                  <p className={styles.newsMeta}>
                    {toLabel(post.category)} · {post.date}
                  </p>
                  <h3 className={styles.newsTitle}>{post.name}</h3>
                  <div className={styles.newsDescription}>
                    {post.description?.length > MAX_LENGTH
                      ? renderDescription(`${post.description.slice(0, MAX_LENGTH)}...`)
                      : renderDescription(post.description || "")}
                  </div>
                </div>
                <Link href={`/noticias/${normalizeName(post.name)}`} className="readMoreBtn">
                  Leer más
                </Link>
              </div>
            ))
          ) : (
            <p>No se encontraron publicaciones para esta categoría.</p>
          )}
        </div>
      </div>

      <FeaturedPosts featuredPosts={featuredPosts} />
    </section>
  );
};

export default BlogNoticias;
