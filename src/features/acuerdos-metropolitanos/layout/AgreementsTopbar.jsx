"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { roleLabel } from '../constants/roles';
import { getNotifications, markNotificationRead } from '../services/agreementsApi';
import styles from './AgreementsLayout.module.css';

export default function AgreementsTopbar({ user, onLogout }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState('');
  const notificationsRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    setNotificationsError('');
    try {
      const data = await getNotifications();
      setNotifications(data.results || []);
      setUnreadCount(data.unread_count || 0);
    } catch {
      setNotificationsError('No se pudieron cargar las notificaciones.');
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    function closeNotifications(event) {
      if (!notificationsRef.current?.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', closeNotifications);
    return () => document.removeEventListener('mousedown', closeNotifications);
  }, []);

  function toggleNotifications() {
    const nextOpen = !notificationsOpen;
    setNotificationsOpen(nextOpen);
    if (nextOpen) {
      loadNotifications();
    }
  }

  async function readNotification(notification) {
    if (notification.read) return;
    setNotifications((items) => items.map((item) => (
      item.id === notification.id ? { ...item, read: true } : item
    )));
    setUnreadCount((count) => Math.max(0, count - 1));
    try {
      await markNotificationRead(notification.id);
    } catch {
      loadNotifications();
    }
  }

  return (
    <header className={styles.topbar}>
      <div>
        <p className={styles.eyebrow}>Sesión activa</p>
        <strong>{user?.username}</strong>
      </div>
      <div className={styles.topbarActions}>
        <span>{roleLabel(user?.role)}</span>
        <div className={styles.notifications} ref={notificationsRef}>
          <button
            type="button"
            className={styles.notificationButton}
            aria-label="Notificaciones"
            aria-expanded={notificationsOpen}
            onClick={toggleNotifications}
          >
            <NotificationsNoneOutlinedIcon aria-hidden="true" />
            {unreadCount > 0 ? <span className={styles.notificationBadge}>{unreadCount}</span> : null}
          </button>
          {notificationsOpen ? (
            <div className={styles.notificationPanel}>
              <strong>Notificaciones</strong>
              {notificationsLoading ? <p>Revisando notificaciones...</p> : null}
              {notificationsError ? <p>{notificationsError}</p> : null}
              {!notificationsLoading && !notificationsError && notifications.length === 0 ? (
                <p>No hay notificaciones por ahora.</p>
              ) : null}
              {notifications.map((notification) => (
                notification.agreement ? (
                  <Link
                    key={`${notification.action}-${notification.id}`}
                    href={`/acuerdos-metropolitanos/acuerdos/${notification.agreement}`}
                    className={`${styles.notificationItem} ${!notification.read ? styles.notificationUnread : ''}`}
                    onClick={() => readNotification(notification)}
                  >
                    {notification.text}
                    <small>{notification.read ? 'Leído' : 'No leído'} · {new Date(notification.created_at).toLocaleString('es-MX')}</small>
                  </Link>
                ) : (
                  <button
                    key={`${notification.action}-${notification.id}`}
                    type="button"
                    className={`${styles.notificationItem} ${!notification.read ? styles.notificationUnread : ''}`}
                    onClick={() => readNotification(notification)}
                  >
                    {notification.text}
                    <small>{notification.read ? 'Leído' : 'No leído'} · {new Date(notification.created_at).toLocaleString('es-MX')}</small>
                  </button>
                )
              ))}
            </div>
          ) : null}
        </div>
        <button type="button" className={styles.topbarLogout} onClick={onLogout}>
          <LogoutOutlinedIcon aria-hidden="true" />
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
