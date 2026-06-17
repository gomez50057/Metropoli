const GENERAL_GROUPS = [
  [/CDMVM/i, 'Consejo de Desarrollo Metropolitano del Valle de México (CDMVM)'],
  [/(PJ|PROCURADURIA|SEGURIDAD)/i, 'Comisión Metropolitana de Seguridad Pública y Procuración de Justicia (CMSPyPJ)'],
];

function publicUrl(path) {
  return `/minutas/${path.split('/').map(encodeURIComponent).join('/')}`;
}

function documentType(name) {
  if (/acta/i.test(name)) return 'Acta';
  if (/acuerdos?/i.test(name)) return 'Acuerdo';
  return 'Minuta';
}

function documentDate(name) {
  const match = name.match(/(\d{2})(\d{2})(\d{2}|\d{4})(?=\.pdf$|[^0-9])/i);
  if (!match) return 'Sin fecha';
  const year = match[3].length === 2 ? `20${match[3]}` : match[3];
  return `${year}-${match[2]}-${match[1]}`;
}

function documentTitle(name) {
  return name
    .replace(/\.pdf$/i, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function groupName(path) {
  const parts = path.split('/');
  if (parts.length > 1) return parts[0];
  return GENERAL_GROUPS.find(([pattern]) => pattern.test(path))?.[1] || 'Documentos generales';
}

function codeFromName(name) {
  return name.match(/\(([^)]+)\)/)?.[1] || '';
}

function normalizeMinute(path, index) {
  const name = path.split('/').pop();
  const group = groupName(path);
  return {
    id: `${index}-${path}`,
    name,
    group,
    instance_name: group,
    instance_code: codeFromName(group),
    document_type: documentType(name),
    display_name: documentTitle(name),
    date: documentDate(name),
    file_type: name.split('.').pop()?.toLowerCase() || '',
    url: publicUrl(path),
  };
}

export async function getMinutes(params) {
  const response = await fetch('/minutas/manifest.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('No se pudieron cargar las minutas.');
  const data = await response.json();
  const items = (data.files || []).map(normalizeMinute);
  const instance = params?.instance;
  return instance ? items.filter((item) => item.instance_code === instance || item.group === instance) : items;
}
