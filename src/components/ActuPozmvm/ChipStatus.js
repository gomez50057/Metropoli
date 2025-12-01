import styles from "@/styles/ActuPozmvm/ChipStatus.module.css";

export default function ChipStatus({ label }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.titule}>Estatus actual</h2>
      <div className={styles.status}>
        <span className={styles.chip} aria-current="step">{label}</span>
      </div>
    </section>
  );
}