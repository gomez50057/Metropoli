"use client";

import { useSession } from './SessionProvider';

export default function RoleGuard({ roles, children, fallback = null }) {
  const { user } = useSession();
  return !roles || roles.includes(user?.role) ? children : fallback;
}
