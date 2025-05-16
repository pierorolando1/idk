import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Chip, Pagination, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { getAllPrestamos, deletePrestamo, updatePrestamo } from '../../../services/prestamosService';
import { Prestamo } from '../../../types/prestamo';

const PrestamosPage: React.FC = () => {
  const [prestamos, setPrestamos] = React.useState<Prestamo[]>([]);
  const [filteredPrestamos, setFilteredPrestamos] = React.useState<Prestamo[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const fetchPrestamos = async () => {
    try {
      setIsLoading(true);
      const data = await getAllPrestamos();
      setPrestamos(data);
      setFilteredPrestamos(data);
    } catch (error) {
      console.error('Error al cargar préstamos:', error);
      setError('Error al cargar los préstamos. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPrestamos();
  }, []);

  React.useEffect(() => {
    const filtered = prestamos.filter(prestamo => 
      prestamo.idPrestamo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestamo.materialId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestamo.usuarioId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPrestamos(filtered);
    setPage(1);
  }, [searchTerm, prestamos]);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este préstamo?')) {
      try {
        await deletePrestamo(id);
        setPrestamos(prestamos.filter(prestamo => prestamo.idPrestamo !== id));
      } catch (error) {
        console.error('Error al eliminar préstamo:', error);
        alert('Error al eliminar el préstamo. Por favor, intente nuevamente.');
      }
    }
  };

  const handleDevolucion = async (prestamo: Prestamo) => {
    if (window.confirm('¿Confirmar la devolución de este material?')) {
      try {
        const updatedPrestamo = {
          ...prestamo,
          fechaDevolucionReal: new Date().toISOString().split('T')[0],
          estado: 'DEVUELTO' as const
        };
        
        const result = await updatePrestamo(prestamo.idPrestamo, updatedPrestamo);
        
        setPrestamos(prestamos.map(p => 
          p.idPrestamo === prestamo.idPrestamo ? result : p
        ));
      } catch (error) {
        console.error('Error al registrar devolución:', error);
        alert('Error al registrar la devolución. Por favor, intente nuevamente.');
      }
    }
  };

  const pages = Math.ceil(filteredPrestamos.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredPrestamos.slice(start, end);
  }, [page, filteredPrestamos, rowsPerPage]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ACTIVO': return 'warning';
      case 'DEVUELTO': return 'success';
      case 'VENCIDO': return 'danger';
      default: return 'default';
    }
  };

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Préstamos</h1>
        <Link to="/admin/registro-prestamo">
          <Button color="primary" startContent={<Icon icon="lucide:plus" />}>
            Nuevo Préstamo
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar por ID de préstamo, material o usuario..."
          value={searchTerm}
          onValueChange={setSearchTerm}
          startContent={<Icon icon="lucide:search" className="text-default-400" />}
          isClearable
          className="w-full sm:max-w-md"
        />
      </div>

      <div className="table-container">
        <Table removeWrapper aria-label="Tabla de préstamos">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>MATERIAL</TableColumn>
            <TableColumn>USUARIO</TableColumn>
            <TableColumn>FECHA PRÉSTAMO</TableColumn>
            <TableColumn>FECHA DEVOLUCIÓN</TableColumn>
            <TableColumn>ESTADO</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No hay préstamos disponibles">
            {items.map((prestamo) => (
              <TableRow key={prestamo.idPrestamo}>
                <TableCell>{prestamo.idPrestamo}</TableCell>
                <TableCell>{prestamo.materialId}</TableCell>
                <TableCell>{prestamo.usuarioId}</TableCell>
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
                <TableCell>
                  <div className="flex gap-2">
                    {prestamo.estado === 'ACTIVO' && (
                      <Button 
                        size="sm" 
                        variant="flat" 
                        color="success"
                        onClick={() => handleDevolucion(prestamo)}
                      >
                        Devolver
                      </Button>
                    )}
                    <Button 
                      isIconOnly 
                      size="sm" 
                      variant="light" 
                      color="danger"
                      aria-label="Eliminar"
                      onClick={() => handleDelete(prestamo.idPrestamo)}
                    >
                      <Icon icon="lucide:trash" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center mt-4">
        <Pagination 
          total={pages} 
          initialPage={1} 
          page={page}
          onChange={setPage}
        />
      </div>
    </div>
  );
};

export default PrestamosPage;