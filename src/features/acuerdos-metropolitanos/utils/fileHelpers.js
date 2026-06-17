export const INITIAL_PDF_MAX_BYTES = 25 * 1024 * 1024;
export const EVIDENCE_MAX_BYTES = 25 * 1024 * 1024;
export const EVIDENCE_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'webm', 'zip', 'rar', 'geojson', 'kml', 'kmz', 'gpkg', 'tif', 'tiff', 'mp3', 'wav', 'glb', 'gltf', 'obj'];
const PREVIEW_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'mp4', 'mov', 'webm', 'mp3', 'wav'];

export function fileExtension(file) {
  return file?.name?.split('.').pop()?.toLowerCase() || '';
}

export function isInitialPdf(file) {
  return !file || (fileExtension(file) === 'pdf' && file.size <= INITIAL_PDF_MAX_BYTES);
}

export function isEvidenceAllowed(file) {
  return !file || (EVIDENCE_EXTENSIONS.includes(fileExtension(file)) && file.size <= EVIDENCE_MAX_BYTES);
}

export function canPreviewFile(file) {
  const mimeType = file?.mime_type || file?.content_type || file?.type || '';
  if (mimeType === 'application/pdf' || /^(image|video|audio)\//.test(mimeType)) return true;

  const source = file?.name || file?.filename || file?.original_name || file?.display_name || file?.url || '';
  const extension = source.split(/[?#]/)[0].split('.').pop().toLowerCase();
  return PREVIEW_EXTENSIONS.includes(extension);
}
