import { WRITE_ROLES, ROLES } from '../constants/roles';

export function canManageAgreements(role) {
  return WRITE_ROLES.includes(role);
}

export function canExportAgreements(role) {
  return WRITE_ROLES.includes(role);
}

export function canCreateUpdates(role) {
  return [ROLES.ADMINISTRADOR, ROLES.CONTROL_TOTAL, ROLES.INSTANCIA].includes(role);
}
