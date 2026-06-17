import styles from "./UltimasNoticias.module.css";
import Link from "next/link";
import { normalizeName, renderDescription } from "@/data/blogData";

const UltimasNoticias = ({ posts }) => {
  const MAX_LENGTH = 50;

  return (
    <section className={styles.ultimasNoticias} aria-labelledby="ultimas-title">
      <h2 id="ultimas-title" className={styles.sectionTitle}>
        <span className="span-doarado">Últimas </span> Noticias
      </h2>

      <div className={styles.newsGrid}>
        {posts.map((post, index) => {
          const postHref = `/noticias/${normalizeName(post.name)}`;

          return (
            <Link
              key={index}
              href={postHref}
              className={styles.newsItem}
              aria-label={`Abrir nota: ${post.name}`}
            >
              <img
                src={post.image}
                alt={post.name}
                className={styles.newsImage}
                loading="lazy"
                decoding="async"
              />
              <h3 className={styles.newsTitle}>{post.name}</h3>
              <p className={styles.newsDate}>{post.date}</p>

              <div className={styles.newsDescription}>
                {post.description.length > MAX_LENGTH
                  ? renderDescription(`${post.description.slice(0, MAX_LENGTH)}...`)
                  : renderDescription(post.description)}
              </div>

              <span className="readMoreBtn" aria-hidden="true">Leer más</span>
              {/* Mostrar cita si existe */}
              {post.quote && <div className={styles.quote}>&quot;{post.quote}&quot;</div>}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default UltimasNoticias;
