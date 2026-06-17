import announcementStyles from './Announcement.module.css';

const Announcement = () => {
  return (
    <section className={announcementStyles["announcement-section"]}>
      <h2>Consulta la cartografía de Hidalgo</h2>
      <p>
        mapa
      </p>
      <a href="/register" className={announcementStyles["cta-button"]}>Acceder al mapa</a>
    </section>
  );
};

export default Announcement;
