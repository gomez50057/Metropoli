import React, { useEffect, useMemo, useState } from "react";
import styles from "./BlogNoticias.module.css";
import FeaturedPosts from "./FeaturedPosts";
import Link from "next/link";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  getPostTopic,
  getPostYear,
  getPostZone,
  normalizeName,
  renderDescription,
} from "@/data/blogData";

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

const BlogNoticias = ({ posts = [], featuredPosts = [] }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Construir opciones de categoría a partir de los posts
  const categoryOptions = useMemo(() => {
    const map = new Map();
    for (const p of posts) {
      if (!p?.category) continue;
      const value = toSlug(p.category);
      if (!value) continue;
      if (!map.has(value)) map.set(value, p.category);
    }
    return [{ value: "todas", label: "Todas" }, ...[...map].map(([value, label]) => ({ value, label }))];
  }, [posts]);

  const zoneOptions = useMemo(
    () => ["todas", ...new Set(posts.map(getPostZone))],
    [posts]
  );
  const topicOptions = useMemo(
    () => ["todas", ...new Set(posts.map(getPostTopic))],
    [posts]
  );
  const yearOptions = useMemo(
    () => ["todas", ...new Set(posts.map(getPostYear))].sort((a, b) => b.localeCompare(a)),
    [posts]
  );
  const [filters, setFilters] = useState({
    category: searchParams.get("categoria") || "todas",
    zone: searchParams.get("zona") || "todas",
    topic: searchParams.get("tema") || "todas",
    year: searchParams.get("anio") || "todas",
  });
  const [fadeEffect, setFadeEffect] = useState(false);

  useEffect(() => {
    setFilters({
      category: searchParams.get("categoria") || "todas",
      zone: searchParams.get("zona") || "todas",
      topic: searchParams.get("tema") || "todas",
      year: searchParams.get("anio") || "todas",
    });
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const nextFilters = { ...filters, [key]: value };
    setFadeEffect(true);
    setTimeout(() => {
      setFilters(nextFilters);
      const params = new URLSearchParams(searchParams.toString());
      const queryKeys = {
        category: "categoria",
        zone: "zona",
        topic: "tema",
        year: "anio",
      };

      Object.entries(queryKeys).forEach(([filterKey, queryKey]) => {
        if (nextFilters[filterKey] === "todas") params.delete(queryKey);
        else params.set(queryKey, nextFilters[filterKey]);
      });

      router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
      setFadeEffect(false);
    }, 300);
  };

  const clearFilters = () => {
    const nextFilters = { category: "todas", zone: "todas", topic: "todas", year: "todas" };
    setFadeEffect(true);
    setTimeout(() => {
      setFilters(nextFilters);
      router.replace(pathname, { scroll: false });
      setFadeEffect(false);
    }, 300);
  };

  const matchesFilters = (post, activeFilters) => (
    (activeFilters.category === "todas" || toSlug(post.category) === activeFilters.category) &&
    (activeFilters.zone === "todas" || getPostZone(post) === activeFilters.zone) &&
    (activeFilters.topic === "todas" || getPostTopic(post) === activeFilters.topic) &&
    (activeFilters.year === "todas" || getPostYear(post) === activeFilters.year)
  );

  const filteredPosts = useMemo(
    () => posts.filter((post) => matchesFilters(post, filters)),
    [filters, posts]
  );

  const getAvailableOptions = (filterKey, options, getValue) => options.filter((option) => {
    const value = getValue(option);
    if (value === "todas" || value === filters[filterKey]) return true;

    const nextFilters = { ...filters, [filterKey]: value };
    return posts.some((post) => matchesFilters(post, nextFilters));
  });

  const hasActiveFilters = Object.values(filters).some((value) => value !== "todas");

  const renderFilterButtons = (label, filterKey, options, getValue, getLabel) => (
    <div className={styles.filterGroup}>
      <p className={styles.filterLabel}>{label}</p>
      <div className={styles.filterButtons}>
        {getAvailableOptions(filterKey, options, getValue).map((option) => {
          const value = getValue(option);
          const isActive = filters[filterKey] === value;

          return (
            <button
              key={value}
              type="button"
              className={`${styles.filterButton} ${isActive ? styles.filterButtonActive : ""}`}
              aria-pressed={isActive}
              onClick={() => handleFilterChange(filterKey, value)}
            >
              {getLabel(option)}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <section className={styles.blogNoticias}>
      <div className={styles.newsSection}>
        <div className={styles.newsHeader}>
          <h2>
            <span>Noticias</span> de las <span>Zonas</span>{" "}
            <span className="span-doarado">Metropolitanas</span>
          </h2>

          <div className={styles.filters} aria-label="Filtros de noticias">
            <div className={styles.filterHeading}>
              <span>Filtrar noticias</span>
              <button
                type="button"
                className={styles.clearFiltersButton}
                onClick={clearFilters}
                disabled={!hasActiveFilters}
              >
                <ClearAllIcon className={styles.clearFiltersIcon} aria-hidden="true" />
                Limpiar filtros
              </button>
            </div>
            {renderFilterButtons("Categorías", "category", categoryOptions, (option) => option.value, (option) => option.label)}
            {renderFilterButtons("Zona metropolitana", "zone", zoneOptions, (option) => option, (option) => option === "todas" ? "Todas" : option)}
            {renderFilterButtons("Tema", "topic", topicOptions, (option) => option, (option) => option === "todas" ? "Todos" : option)}
            {renderFilterButtons("Año", "year", yearOptions, (option) => option, (option) => option === "todas" ? "Todos" : option)}
          </div>
        </div>

        <div className={`${styles.newsGrid} ${fadeEffect ? styles.fadeOut : styles.fadeIn}`}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => {
              const postHref = `/noticias/${normalizeName(post.name)}`;

              return (
                <Link
                  key={normalizeName(post.name)}
                  href={postHref}
                  className={styles.newsItem}
                  aria-label={`Abrir nota: ${post.name}`}
                >
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
                      {post.category} · {post.date}
                    </p>
                    <h3 className={styles.newsTitle}>{post.name}</h3>
                    <div className={styles.newsDescription}>
                      {post.description?.length > MAX_LENGTH
                        ? renderDescription(`${post.description.slice(0, MAX_LENGTH)}...`)
                        : renderDescription(post.description || "")}
                    </div>
                  </div>
                  <span className="readMoreBtn" aria-hidden="true">
                    Leer más
                  </span>
                </Link>
              );
            })
          ) : (
            <p>No se encontraron publicaciones con los filtros seleccionados.</p>
          )}
        </div>
      </div>

      <div className={styles.featuredCol}>
        <FeaturedPosts featuredPosts={featuredPosts} />
      </div>
    </section>
  );
};

export default BlogNoticias;
