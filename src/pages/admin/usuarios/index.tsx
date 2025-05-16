import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Chip, Pagination, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { getAllUsuarios, deleteUsuario } from '../../../services/usuariosService';
import { Usuario } from '../../../types/usuario';

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = React.useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = React.useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const fetchUsuarios = async () => {
    try {
      setIsLoading(true);
      const data = await getAllUsuarios();
      setUsuarios(data);
      setFilteredUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar los usuarios. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsuarios();
  }, []);

  React.useEffect(() => {
    const filtered = usuarios.filter(usuario => 
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsuarios(filtered);
    setPage(1);
  }, [searchTerm, usuarios]);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este usuario?')) {
      try {
        await deleteUsuario(id);
        setUsuarios(usuarios.filter(usuario => usuario.id !== id));
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar el usuario. Por favor, intente nuevamente.');
      }
    }
  };

  const pages = Math.ceil(filteredUsuarios.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredUsuarios.slice(start, end);
  }, [page, filteredUsuarios, rowsPerPage]);

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
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Usuarios</h1>
        <Link to="/admin/registro-usuario">
          <Button color="primary" startContent={<Icon icon="lucide:plus" />}>
            Nuevo Usuario
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar por nombre, email o ID..."
          value={searchTerm}
          onValueChange={setSearchTerm}
          startContent={<Icon icon="lucide:search" className="text-default-400" />}
          isClearable
          className="w-full sm:max-w-md"
        />
      </div>

      <div className="table-container">
        <Table removeWrapper aria-label="Tabla de usuarios">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>NOMBRE</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>TELÉFONO</TableColumn>
            <TableColumn>ESTADO</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No hay usuarios disponibles">
            {items.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.id}</TableCell>
                <TableCell>{usuario.nombre}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.telefono}</TableCell>
                <TableCell>
                  <Chip 
                    size="sm" 
                    color={usuario.estado === 'ACTIVO' ? 'success' : 'danger'}
                    variant="flat"
                  >
                    {usuario.estado}
                  </Chip>
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
                      onClick={() => handleDelete(usuario.id)}
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

export default UsuariosPage;