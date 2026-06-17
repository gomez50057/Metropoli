export const AGREEMENT_STATUSES = [
  { value: 'EN_PROCESO', label: 'En proceso' },
  { value: 'TERMINADO', label: 'Atendido' },
  { value: 'CANCELADO', label: 'Cancelado' },
];

export function agreementStatusLabel(status, label) {
  if (status === 'TERMINADO' || /terminado/i.test(label || '')) return 'Atendido';
  return AGREEMENT_STATUSES.find((item) => item.value === status)?.label || label || status;
}

export const UPDATE_STATUSES = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'VALIDADA', label: 'Validada' },
  { value: 'RECHAZADA', label: 'Rechazada' },
];
