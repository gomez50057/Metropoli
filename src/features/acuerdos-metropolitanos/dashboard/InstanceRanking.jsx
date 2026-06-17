"use client";

import styles from './AgreementsDashboard.module.css';

export default function InstanceRanking({ items = [], title = 'Por instancia' }) {
  return (
    <section className={styles.panel}>
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id || item.name}>
            <span>{item.name || item.instance}</span>
            <strong>{item.total}</strong>
          </li>
        ))}
        {!items.length && <li><span>Sin datos</span><strong>0</strong></li>}
      </ul>
    </section>
  );
}
