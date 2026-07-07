import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import styles from './MinutesByInstance.module.css';

export default function MinutesAccordion({ title, items, defaultOpen = false, canManage = false, onOpen, onEdit, onDelete }) {
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
              <button type="button" onClick={() => onOpen(minute)} aria-label={`Abrir ${minute.display_name}`}>
                <VisibilityOutlinedIcon fontSize="small" />
                <span>Abrir</span>
              </button>
              {canManage && (
                <>
                  <button type="button" onClick={() => onEdit(minute)} aria-label={`Editar ${minute.display_name}`}>
                    <EditOutlinedIcon fontSize="small" />
                    <span>Editar</span>
                  </button>
                  <button type="button" onClick={() => onDelete(minute)} aria-label={`Eliminar ${minute.display_name}`}>
                    <DeleteOutlineOutlinedIcon fontSize="small" />
                    <span>Eliminar</span>
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </details>
  );
}
