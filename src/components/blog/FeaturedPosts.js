import styles from "./FeaturedPosts.module.css";
import Link from "next/link";
import { normalizeName } from "@/utils/blogData";
import SafeImage from "./shared/SafeImage";

const FeaturedPosts = ({ featuredPosts = [] }) => {
  if (!featuredPosts.length) return null;

  return (
    <aside className={styles.featuredSection} aria-labelledby="featured-title">
      <h3 id="featured-title" className={styles.featuredTitle}>
        Publicación destacada
      </h3>

      <ul className={styles.featuredList}>
        {featuredPosts.map((post) => (
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
    </aside>
  );
};

export default FeaturedPosts;
