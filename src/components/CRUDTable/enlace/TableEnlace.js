'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
} from 'material-react-table';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Typography,
  Button,
  Box,
} from '@mui/material';
import axios from 'axios';
import ProjectModal from '../ProjectModal';
import '../CRUDTable.css';

const TableEnlace = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [modalMode, setModalMode] = useState('update');
  const [noDataMessage, setNoDataMessage] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/acuerdos/`);
      setData(response.data);
      filterDataByUserStateAndCommission(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filterDataByUserStateAndCommission = (data) => {
    const userState = localStorage.getItem('userState');
    const userCommission = localStorage.getItem('userCommission');

    if (userState && userCommission) {
      const filtered = data.filter(
        (item) => item.estado === userState && item.comision === userCommission
      );
      setFilteredData(filtered);
      setNoDataMessage(filtered.length === 0 ? "No hay acuerdos disponibles." : "");
    } else {
      setFilteredData([]);
      setNoDataMessage("No hay acuerdos disponibles.");
    }
  };

  const handleUpdateClick = (projectId) => {
    setSelectedProjectId(projectId);
    setModalMode('update');
    setOpenModal(true);
  };

  const handleAdvancesClick = (projectId) => {
    setSelectedProjectId(projectId);
    setModalMode('advances');
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProjectId(null);
    fetchData();
  };

  const columnHelper = createMRTColumnHelper();

  const columns = [
    columnHelper.accessor('id_unico', {
      header: 'ID Acuerdo',
    }),
    columnHelper.accessor('fecha_creacion', {
      header: 'Fecha',
    }),
    columnHelper.accessor('descripcion_acuerdo', {
      header: 'Descripción del Acuerdo',
    }),
    columnHelper.accessor('estatus', {
      header: 'Estatus',
      Cell: ({ cell }) => {
        const value = cell.getValue();
        const map = {
          sin_avance: { label: 'Sin Avance', color: '#FF0000' },
          en_proceso: { label: 'En Proceso', color: '#FFA500' },
          atendido: { label: 'Atendido', color: '#008000' },
          cancelado: { label: 'Cancelado', color: '#808080' },
        };
        const { label, color } = map[value] || { label: value, color: 'inherit' };
        return (
          <span style={{
            backgroundColor: color,
            padding: '10px',
            borderRadius: '20px',
            color: '#f5f5f5',
            display: 'inline-block',
            minWidth: '100px',
            textAlign: 'center',
          }}>
            {label}
          </span>
        );
      },
    }),
    columnHelper.accessor('descripcion_avance', {
      header: 'Avances',
      Cell: ({ row }) => (
        <Button
          className="crud-button"
          onClick={() => handleAdvancesClick(row.original.id)}
        >
          Ver todos los avances
        </Button>
      ),
    }),
    columnHelper.accessor('documentos', {
      header: 'Documentos',
    }),
    {
      id: 'acciones',
      header: 'Acciones',
      enableSorting: false,
      enableColumnPinning: true,
      muiTableBodyCellProps: {
        className: 'acciones-cell',
      },
      muiTableHeadCellProps: {
        className: 'acciones-header',
      },
      Cell: ({ row }) => (
        <Box display="flex" className="Acciones-con">
          <Button className="crud-button" onClick={() => handleUpdateClick(row.original.id)}>
            Actualizar
          </Button>
        </Box>
      ),
    },
  ];

  const table = useMaterialReactTable({
    data: filteredData,
    columns,
    enableColumnActions: false,
    enableColumnPinning: true,
    enableDensityToggle: false,
    enableColumnFilters: false,
    initialState: {
      columnPinning: {
        right: ['acciones'],
      },
    },
    muiTableBodyRowProps: {
      sx: {
        '&:hover': {
          backgroundColor: 'rgba(230, 230, 230)',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#f5f5f5',
        fontWeight: 'bold',
      },
    },
    localization: {
      noRecordsToDisplay: noDataMessage || 'No se encontraron registros',
      actions: 'Acciones',
      search: 'Buscar',
      showHideColumns: 'Ver columnas',
    },
  });

  const theme = createTheme({
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '40px',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          h3: {
            fontWeight: 600,
            fontSize: '2.25rem',
            color: '#DEC9A3',
            fontFamily: 'Montserrat',
            padding: '10px',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="table_grid">
        <Typography variant="h3">Acuerdos Enlace</Typography>
        <MaterialReactTable table={table} />
      </div>

      <ProjectModal
        open={openModal}
        handleClose={handleCloseModal}
        projectId={selectedProjectId}
        mode={modalMode}
      />
    </ThemeProvider>
  );
};

export default TableEnlace;
