import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllAdvances.css';

const AllAdvances = ({ projectId, onClose }) => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/actualizaciones/?acuerdo=${projectId}`);
        
        // Asegúrate de que estás filtrando las actualizaciones solo para el acuerdo actual
        const filteredUpdates = response.data.filter(update => update.acuerdo === projectId);
        setUpdates(filteredUpdates);
        
      } catch (error) {
        console.error('Error fetching updates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, [projectId]);

  if (loading) {
    return <div>Cargando historial de los avances...</div>;
  }

  return (
    <div className="history-list">
      <h3>Todos los Avances </h3>
      <ul>
        {updates.map((update) => (
          <li key={update.id}>
            <p><strong>Versión:</strong> {update.version}</p>
            <p><strong>Fecha:</strong> {update.fecha_actualizacion}</p>
            <p><strong>Descripción del Avance:</strong> {update.descripcion_avance}</p>
            <p>
              <strong>Documentos:</strong> {update.documentos ? (
                <a href={update.documentos} target="_blank" rel="noopener noreferrer">Ver Documento</a>
              ) : 'No disponible'}
            </p>
          </li>
        ))}
      </ul>
      <button onClick={onClose} className="close-button">Cerrar</button>
    </div>
  );
};

export default AllAdvances;
