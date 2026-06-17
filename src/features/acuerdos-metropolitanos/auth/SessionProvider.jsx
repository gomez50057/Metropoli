"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { normalizeRole } from '../constants/roles';
import { clearAccessToken, setAccessToken } from '../services/apiClient';
import { loginRequest, logoutRequest, meRequest, refreshRequest } from '../services/authApi';

const SessionContext = createContext(null);

function userFromPayload(payload) {
  const user = payload.user || payload;
  return { ...user, role: normalizeRole(user?.role) };
}

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;

    async function bootSession() {
      try {
        const refreshed = await refreshRequest();
        if (refreshed.access) {
          setAccessToken(refreshed.access);
        }
        const profile = await meRequest();
        if (active) {
          setUser(userFromPayload(profile));
          setStatus('authenticated');
        }
      } catch {
        clearAccessToken();
        if (active) {
          setUser(null);
          setStatus('anonymous');
        }
      }
    }

    bootSession();

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({
    user,
    status,
    async login(values) {
      const payload = await loginRequest(values);
      setAccessToken(payload.access);
      setUser(userFromPayload(payload));
      setStatus('authenticated');
      return userFromPayload(payload);
    },
    async logout() {
      try {
        await logoutRequest();
      } finally {
        clearAccessToken();
        setUser(null);
        setStatus('anonymous');
      }
    },
  }), [user, status]);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error('useSession debe usarse dentro de SessionProvider');
  }
  return value;
}
