export const UPLOAD_MAX_BYTES = 25 * 1024 * 1024;
export const UPLOAD_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'webm', 'zip', 'rar', 'geojson', 'kml', 'kmz', 'gpkg', 'tif', 'tiff', 'mp3', 'wav', 'glb', 'gltf', 'obj', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'mpk'];
export const UPLOAD_ACCEPT = UPLOAD_EXTENSIONS.map((extension) => `.${extension}`).join(',');
export const UPLOAD_RULE_TEXT = 'Solo se aceptan PDF, JPG, JPEG, PNG, WEBP, MP4, MOV, WEBM, ZIP, RAR, GEOJSON, KML, KMZ, GPKG, TIF, TIFF, MP3, WAV, GLB, GLTF, OBJ, DOC, DOCX, XLS, XLSX, PPT, PPTX, MPK. Tamaño máximo: 25.0 MB por archivo.';
export const AGREEMENT_DOCUMENT_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];
export const AGREEMENT_DOCUMENT_ACCEPT = AGREEMENT_DOCUMENT_EXTENSIONS.map((extension) => `.${extension}`).join(',');
export const AGREEMENT_DOCUMENT_RULE_TEXT = 'Solo se acepta un archivo PDF, JPG, JPEG, PNG, DOC o DOCX. Tamaño máximo: 25.0 MB.';
const PREVIEW_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'mp4', 'mov', 'webm', 'mp3', 'wav'];

export function fileExtension(file) {
  return file?.name?.split('.').pop()?.toLowerCase() || '';
}

export function isUploadAllowed(file) {
  return !file || (UPLOAD_EXTENSIONS.includes(fileExtension(file)) && file.size <= UPLOAD_MAX_BYTES);
}

export function isAgreementDocumentAllowed(file) {
  return !file || (AGREEMENT_DOCUMENT_EXTENSIONS.includes(fileExtension(file)) && file.size <= UPLOAD_MAX_BYTES);
}

export function canPreviewFile(file) {
  const mimeType = file?.mime_type || file?.content_type || file?.type || '';
  if (mimeType === 'application/pdf' || /^(image|video|audio)\//.test(mimeType)) return true;

  const source = file?.name || file?.filename || file?.original_name || file?.display_name || file?.url || '';
  const extension = source.split(/[?#]/)[0].split('.').pop().toLowerCase();
  return PREVIEW_EXTENSIONS.includes(extension);
}
