"use client";

import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AudioFileOutlinedIcon from '@mui/icons-material/AudioFileOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import styles from './AgreementForm.module.css';

function FileIcon({ file }) {
  const type = file.type || '';
  const name = file.name.toLowerCase();
  if (type.includes('pdf') || name.endsWith('.pdf')) return <PictureAsPdfOutlinedIcon fontSize="small" />;
  if (type.startsWith('image/')) return <ImageOutlinedIcon fontSize="small" />;
  if (type.startsWith('video/')) return <MovieOutlinedIcon fontSize="small" />;
  if (type.startsWith('audio/')) return <AudioFileOutlinedIcon fontSize="small" />;
  if (name.endsWith('.xls') || name.endsWith('.xlsx') || name.endsWith('.csv')) return <TableChartOutlinedIcon fontSize="small" />;
  if (name.endsWith('.doc') || name.endsWith('.docx') || name.endsWith('.txt')) return <ArticleOutlinedIcon fontSize="small" />;
  return <InsertDriveFileOutlinedIcon fontSize="small" />;
}

function formatSize(bytes) {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extensionList(extensions) {
  return extensions.map((ext) => ext.toUpperCase()).join(', ');
}

function rejectMessage(file, acceptedExtensions, maxSize) {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  if (acceptedExtensions.length && !acceptedExtensions.includes(extension)) {
    return `${file.name}: solo se aceptan ${extensionList(acceptedExtensions)}.`;
  }
  if (maxSize && file.size > maxSize) {
    return `${file.name}: supera el límite de ${formatSize(maxSize)}.`;
  }
  return '';
}

export default function EvidenceUpload({
  id = 'evidence',
  label = 'Evidencias',
  multiple = true,
  accept,
  acceptedExtensions = [],
  maxSize,
  clearKey = 0,
  onChange,
}) {
  const [files, setFiles] = useState([]);
  const [notice, setNotice] = useState('');
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: accept ? { [accept.split(',')[0]]: accept.split(',').slice(1) } : undefined,
    multiple,
    maxSize,
    onDrop: (acceptedFiles, rejectedFiles) => {
      const rejected = [
        ...acceptedFiles.map((file) => rejectMessage(file, acceptedExtensions, maxSize)).filter(Boolean),
        ...rejectedFiles.map(({ file }) => rejectMessage(file, acceptedExtensions, maxSize) || `${file.name}: archivo no permitido.`),
      ];
      const allowedFiles = acceptedFiles.filter((file) => !rejectMessage(file, acceptedExtensions, maxSize));
      const selected = multiple ? allowedFiles : allowedFiles.slice(0, 1);
      setFiles(selected);
      setNotice(rejected[0] || '');
      onChange(multiple ? selected : selected[0] || null);
    },
  });

  useEffect(() => {
    setFiles([]);
    setNotice('');
  }, [clearKey]);

  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>{label}</label>
      <div {...getRootProps()} className={`${styles.dropzone} ${isDragActive ? styles.dropzoneActive : ''}`}>
        <input {...getInputProps({ id, name: id })} />
        <InsertDriveFileOutlinedIcon />
        <span>{isDragActive ? 'Suelta los archivos aquí' : 'Arrastra archivos o haz clic para seleccionar'}</span>
      </div>
      <p className={styles.uploadNotice}>
        Solo se aceptan {acceptedExtensions.length ? extensionList(acceptedExtensions) : 'los archivos permitidos'}.
        {maxSize ? ` Tamaño máximo: ${formatSize(maxSize)} por archivo.` : ''}
      </p>
      {notice && <div className={styles.uploadError} role="alert">{notice}</div>}
      {!!files.length && (
        <ul className={styles.fileList}>
          {files.map((file) => (
            <li key={`${file.name}-${file.size}`}>
              <FileIcon file={file} />
              <span>{file.name}</span>
              <small>{formatSize(file.size)}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
