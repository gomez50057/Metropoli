export const INITIAL_PDF_MAX_BYTES = 25 * 1024 * 1024;
export const EVIDENCE_MAX_BYTES = 25 * 1024 * 1024;
export const EVIDENCE_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'webm', 'zip', 'rar', 'geojson', 'kml', 'kmz', 'gpkg', 'tif', 'tiff', 'mp3', 'wav', 'glb', 'gltf', 'obj'];

export function fileExtension(file) {
  return file?.name?.split('.').pop()?.toLowerCase() || '';
}

export function isInitialPdf(file) {
  return !file || (fileExtension(file) === 'pdf' && file.size <= INITIAL_PDF_MAX_BYTES);
}

export function isEvidenceAllowed(file) {
  return !file || (EVIDENCE_EXTENSIONS.includes(fileExtension(file)) && file.size <= EVIDENCE_MAX_BYTES);
}
