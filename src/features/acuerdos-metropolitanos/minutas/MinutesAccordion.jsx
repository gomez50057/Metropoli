import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import styles from './MinutesByInstance.module.css';

export default function MinutesAccordion({ title, items, defaultOpen = false }) {
  const counts = items.reduce((total, item) => ({ ...total, [item.document_type]: (total[item.document_type] || 0) + 1 }), {});
  const summary = ['Minuta', 'Acta', 'Acuerdo']
    .filter((type) => counts[type])
    .map((type) => `${counts[type]} ${type.toLowerCase()}${counts[type] > 1 ? 's' : ''}`)
    .join(' / ');

  return (
    <details className={styles.card} open={defaultOpen}>
      <summary className={styles.cardHeader}>
        <span className={styles.instanceIcon}><AccountBalanceOutlinedIcon fontSize="small" /></span>
        <span>
          <span className={styles.instanceName}>{title}</span>
          <span className={styles.instanceSummary}>{summary}</span>
        </span>
        <KeyboardArrowDownOutlinedIcon className={styles.chevron} fontSize="small" />
      </summary>
      <div className={styles.minuteList}>
        {items.map((minute) => (
          <article className={styles.minuteRow} key={minute.id}>
            <div className={styles.documentInfo}>
              <span className={styles.typeBadge}>{minute.document_type}</span>
              <strong>{minute.display_name}</strong>
              <span>{minute.date}</span>
            </div>
            <div className={styles.rowActions}>
              <a href={minute.url} target="_blank" rel="noreferrer" aria-label={`Abrir ${minute.display_name}`}>
                <VisibilityOutlinedIcon fontSize="small" />
                <span>Abrir</span>
              </a>
              <a href={minute.url} download={minute.name} aria-label={`Descargar ${minute.display_name}`}>
                <FileDownloadOutlinedIcon fontSize="small" />
                <span>Descargar</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </details>
  );
}
