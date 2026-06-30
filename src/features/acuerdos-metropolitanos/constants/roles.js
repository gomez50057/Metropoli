export const ROLES = {
  ADMINISTRADOR: 'ADMINISTRADOR',
  CONTROL_TOTAL: 'CONTROL_TOTAL',
  SEGUIMIENTO: 'SEGUIMIENTO',
  CONSULTA: 'CONSULTA',
};

export const WRITE_ROLES = [ROLES.ADMINISTRADOR, ROLES.CONTROL_TOTAL];

export const ROLE_LABELS = {
  [ROLES.ADMINISTRADOR]: 'Administrador',
  [ROLES.CONTROL_TOTAL]: 'Control total',
  [ROLES.SEGUIMIENTO]: 'Seguimiento',
  [ROLES.CONSULTA]: 'Consulta',
};

export function normalizeRole(role) {
  return String(role || '').toUpperCase();
}

export function roleLabel(role) {
  const normalized = normalizeRole(role);
  return ROLE_LABELS[normalized] || normalized || 'Sin rol';
}
