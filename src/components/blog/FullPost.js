import Navbar from "../shared/Navbar";
import FeaturedPosts from "./FeaturedPosts";
import SafeImage from "./shared/SafeImage";
import styles from "./FullPost.module.css";
import { renderDescription } from "../../utils/blogData";

export default function FullPost({ post, featuredPosts = [] }) {
  if (!post) {
    return (
      <>
        <Navbar />
        <main className={styles.layout}>
          <p className={styles.notFound}>La publicación no existe.</p>
        </main>
      </>
    );
  }

  const author =
    (post.authorEmail && String(post.authorEmail).trim()) ||
    "Coordinación General de Planeación y Proyectos";

  const sidebarPosts = featuredPosts.filter((p) => p?.name !== post.name);

  return (
    <>
      <Navbar />

      <main className={styles.layout}>
        <article className={styles.postCard}>
          {post.image ? (
            <figure className={styles.hero}>
              <SafeImage
                src={post.image}
                alt={post.name || "Imagen de la publicación"}
                className={styles.postImage}
                loading="lazy"
                decoding="async"
                fallbackSrc="/img/placeholder.webp"
              />
            </figure>
          ) : null}

          <header className={styles.header}>
            <p className={styles.meta}>
              <span className={styles.author}>{author}</span>
              <span className={styles.metaDot}>·</span>
              <time className={styles.date}>{post.date}</time>
            </p>

            <h1 className={styles.title}>{post.name}</h1>
          </header>

          <section className={styles.body}>
            <ul className={styles.descriptionList}>
              {renderDescription(post.description)}
            </ul>

            {post.quote ? (
              <blockquote className={styles.quote}>
                &quot;{post.quote}&quot;
              </blockquote>
            ) : null}
          </section>
        </article>

        <aside className={styles.sidebar} aria-label="Publicaciones destacadas">
          <FeaturedPosts featuredPosts={sidebarPosts} />
        </aside>
      </main>
    </>
  );
}
