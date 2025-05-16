import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Button, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../../context/AuthContext';
import { getPrestamosByUsuarioId } from '../../../services/prestamosService';
import { getAllMateriales } from '../../../services/materialesService';
import { getUsuarioById } from '../../../services/usuariosService';
import { Prestamo } from '../../../types/prestamo';
import { Material } from '../../../types/material';
import { Usuario } from '../../../types/usuario';

const UserDashboard: React.FC = () => {
  const { userId } = useAuth();
  const [prestamos, setPrestamos] = React.useState<Prestamo[]>([]);
  const [materiales, setMateriales] = React.useState<Material[]>([]);
  const [usuario, setUsuario] = React.useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const [prestamosData, materialesData, usuarioData] = await Promise.all([
          getPrestamosByUsuarioId(userId),
          getAllMateriales(),
          getUsuarioById(userId)
        ]);
        
        setPrestamos(prestamosData);
        setMateriales(materialesData);
        setUsuario(usuarioData);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const prestamosPendientes = prestamos.filter(p => p.estado === 'ACTIVO').length;
  const prestamosVencidos = prestamos.filter(p => p.estado === 'VENCIDO').length;

  const getMaterialTitle = (id: string): string => {
    const material = materiales.find(m => m.id === id);
    return material ? material.titulo : 'Material no encontrado';
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
      <h1 className="text-2xl font-bold mb-6">Bienvenido, {usuario?.nombre}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-2 rounded-full bg-primary-100">
              <Icon icon="lucide:book" className="text-primary" width={24} height={24} />
            </div>
            <div>
              <p className="text-sm text-default-500">Materiales Disponibles</p>
              <p className="text-2xl font-semibold">{materiales.length}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-2 rounded-full bg-warning-100">
              <Icon icon="lucide:clipboard-list" className="text-warning" width={24} height={24} />
            </div>
            <div>
              <p className="text-sm text-default-500">Préstamos Activos</p>
              <p className="text-2xl font-semibold">{prestamosPendientes}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-2 rounded-full bg-danger-100">
              <Icon icon="lucide:alert-triangle" className="text-danger" width={24} height={24} />
            </div>
            <div>
              <p className="text-sm text-default-500">Préstamos Vencidos</p>
              <p className="text-2xl font-semibold">{prestamosVencidos}</p>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <div className="flex w-full justify-between items-center">
              <h4 className="font-bold text-large">Mis Préstamos</h4>
              <Link to="/user/mis-prestamos">
                <Button size="sm" variant="light">Ver todos</Button>
              </Link>
            </div>
            <p className="text-tiny text-default-500">Préstamos activos y recientes</p>
          </CardHeader>
          <CardBody>
            {prestamos.slice(0, 5).map((prestamo) => (
              <div key={prestamo.idPrestamo} className="border-b border-divider py-2 last:border-none">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{getMaterialTitle(prestamo.materialId)}</p>
                    <p className="text-sm text-default-500">
                      Préstamo: {new Date(prestamo.fechaPrestamo).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      Devolución: {new Date(prestamo.fechaDevolucionEsperada).toLocaleDateString()}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      prestamo.estado === 'ACTIVO' ? 'bg-warning-100 text-warning-600' : 
                      prestamo.estado === 'DEVUELTO' ? 'bg-success-100 text-success-600' : 
                      'bg-danger-100 text-danger-600'
                    }`}>
                      {prestamo.estado}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {prestamos.length === 0 && (
              <p className="text-center text-default-500 py-4">No tienes préstamos activos</p>
            )}
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <div className="flex w-full justify-between items-center">
              <h4 className="font-bold text-large">Catálogo</h4>
              <Link to="/user/catalogo">
                <Button size="sm" variant="light">Ver catálogo</Button>
              </Link>
            </div>
            <p className="text-tiny text-default-500">Materiales disponibles</p>
          </CardHeader>
          <CardBody>
            {materiales.slice(0, 5).map((material) => (
              <div key={material.id} className="border-b border-divider py-2 last:border-none">
                <div>
                  <p className="font-medium">{material.titulo}</p>
                  <div className="flex justify-between">
                    <p className="text-sm text-default-500">
                      {material.autor} ({material.anioPublicacion})
                    </p>
                    <p className="text-sm">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-600">
                        {material.idioma}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;