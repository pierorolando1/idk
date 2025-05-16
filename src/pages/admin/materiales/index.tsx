import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Chip, Pagination, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { getAllMateriales, deleteMaterial } from '../../../services/materialesService';
import { Material } from '../../../types/material';

const MaterialesPage: React.FC = () => {
  const [materiales, setMateriales] = React.useState<Material[]>([]);
  const [filteredMateriales, setFilteredMateriales] = React.useState<Material[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const fetchMateriales = async () => {
    try {
      setIsLoading(true);
      const data = await getAllMateriales();
      setMateriales(data);
      setFilteredMateriales(data);
    } catch (error) {
      console.error('Error al cargar materiales:', error);
      setError('Error al cargar los materiales. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMateriales();
  }, []);

  React.useEffect(() => {
    const filtered = materiales.filter(material => 
      material.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMateriales(filtered);
    setPage(1);
  }, [searchTerm, materiales]);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este material?')) {
      try {
        await deleteMaterial(id);
        setMateriales(materiales.filter(material => material.id !== id));
      } catch (error) {
        console.error('Error al eliminar material:', error);
        alert('Error al eliminar el material. Por favor, intente nuevamente.');
      }
    }
  };

  const pages = Math.ceil(filteredMateriales.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredMateriales.slice(start, end);
  }, [page, filteredMateriales, rowsPerPage]);

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
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Materiales</h1>
        <Link to="/admin/registro-material">
          <Button color="primary" startContent={<Icon icon="lucide:plus" />}>
            Nuevo Material
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar por título, autor o ID..."
          value={searchTerm}
          onValueChange={setSearchTerm}
          startContent={<Icon icon="lucide:search" className="text-default-400" />}
          isClearable
          className="w-full sm:max-w-md"
        />
      </div>

      <div className="table-container">
        <Table removeWrapper aria-label="Tabla de materiales">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>TÍTULO</TableColumn>
            <TableColumn>AUTOR</TableColumn>
            <TableColumn>AÑO</TableColumn>
            <TableColumn>IDIOMA</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No hay materiales disponibles">
            {items.map((material) => (
              <TableRow key={material.id}>
                <TableCell>{material.id}</TableCell>
                <TableCell>{material.titulo}</TableCell>
                <TableCell>{material.autor}</TableCell>
                <TableCell>{material.anioPublicacion}</TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat">{material.idioma}</Chip>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      isIconOnly 
                      size="sm" 
                      variant="light" 
                      color="primary"
                      aria-label="Editar"
                    >
                      <Icon icon="lucide:edit" />
                    </Button>
                    <Button 
                      isIconOnly 
                      size="sm" 
                      variant="light" 
                      color="danger"
                      aria-label="Eliminar"
                      onClick={() => handleDelete(material.id)}
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

export default MaterialesPage;