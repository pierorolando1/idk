import React from 'react';
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Input, Pagination, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../../context/AuthContext';
import { getPrestamosByUsuarioId } from '../../../services/prestamosService';
import { getAllMateriales } from '../../../services/materialesService';
import { Prestamo } from '../../../types/prestamo';
import { Material } from '../../../types/material';

const MisPrestamosPage: React.FC = () => {
  const { userId } = useAuth();
  const [prestamos, setPrestamos] = React.useState<Prestamo[]>([]);
  const [filteredPrestamos, setFilteredPrestamos] = React.useState<Prestamo[]>([]);
  const [materiales, setMateriales] = React.useState<Material[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  React.useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const [prestamosData, materialesData] = await Promise.all([
          getPrestamosByUsuarioId(userId),
          getAllMateriales()
        ]);
        
        setPrestamos(prestamosData);
        setFilteredPrestamos(prestamosData);
        setMateriales(materialesData);
      } catch (error) {
        console.error('Error al cargar préstamos:', error);
        setError('Error al cargar los préstamos. Por favor, intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  React.useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPrestamos(prestamos);
    } else {
      const filtered = prestamos.filter(prestamo => {
        const material = materiales.find(m => m.id === prestamo.materialId);
        return material && material.titulo.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredPrestamos(filtered);
    }
    setPage(1);
  }, [searchTerm, prestamos, materiales]);

  const getMaterialTitle = (id: string): string => {
    const material = materiales.find(m => m.id === id);
    return material ? material.titulo : 'Material no encontrado';
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ACTIVO': return 'warning';
      case 'DEVUELTO': return 'success';
      case 'VENCIDO': return 'danger';
      default: return 'default';
    }
  };

  const pages = Math.ceil(filteredPrestamos.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredPrestamos.slice(start, end);
  }, [page, filteredPrestamos, rowsPerPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-danger p-4">
        <Icon icon="lucide:alert-circle" className="mb-2" width={32} height={32} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-6">Mis Préstamos</h1>
      
      <div className="mb-4">
        <Input
          placeholder="Buscar por título..."
          value={searchTerm}
          onValueChange={setSearchTerm}
          startContent={<Icon icon="lucide:search" className="text-default-400" />}
          isClearable
          className="w-full sm:max-w-md"
        />
      </div>
      
      <Card>
        <CardBody>
          <div className="table-container">
            <Table removeWrapper aria-label="Tabla de mis préstamos">
              <TableHeader>
                <TableColumn>MATERIAL</TableColumn>
                <TableColumn>FECHA PRÉSTAMO</TableColumn>
                <TableColumn>FECHA DEVOLUCIÓN</TableColumn>
                <TableColumn>ESTADO</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No tienes préstamos registrados">
                {items.map((prestamo) => (
                  <TableRow key={prestamo.idPrestamo}>
                    <TableCell>{getMaterialTitle(prestamo.materialId)}</TableCell>
                    <TableCell>{new Date(prestamo.fechaPrestamo).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {prestamo.fechaDevolucionReal 
                        ? new Date(prestamo.fechaDevolucionReal).toLocaleDateString()
                        : new Date(prestamo.fechaDevolucionEsperada).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        size="sm" 
                        color={getEstadoColor(prestamo.estado)}
                        variant="flat"
                      >
                        {prestamo.estado}
                      </Chip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {pages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination 
                total={pages} 
                initialPage={1} 
                page={page}
                onChange={setPage}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default MisPrestamosPage;