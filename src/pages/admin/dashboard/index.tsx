import React from 'react';
import { Card, CardBody, CardHeader, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { getAllMateriales } from '../../../services/materialesService';
import { getAllUsuarios } from '../../../services/usuariosService';
import { getAllPrestamos } from '../../../services/prestamosService';
import { Material } from '../../../types/material';
import { Usuario } from '../../../types/usuario';
import { Prestamo } from '../../../types/prestamo';

const AdminDashboard: React.FC = () => {
  const [materiales, setMateriales] = React.useState<Material[]>([]);
  const [usuarios, setUsuarios] = React.useState<Usuario[]>([]);
  const [prestamos, setPrestamos] = React.useState<Prestamo[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [materialesData, usuariosData, prestamosData] = await Promise.all([
          getAllMateriales(),
          getAllUsuarios(),
          getAllPrestamos()
        ]);
        
        setMateriales(materialesData);
        setUsuarios(usuariosData);
        setPrestamos(prestamosData);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const prestamosPendientes = prestamos.filter(p => p.estado === 'ACTIVO').length;
  const prestamosVencidos = prestamos.filter(p => p.estado === 'VENCIDO').length;

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
      <h1 className="text-2xl font-bold mb-6">Dashboard de Administrador</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-2 rounded-full bg-primary-100">
              <Icon icon="lucide:book" className="text-primary" width={24} height={24} />
            </div>
            <div>
              <p className="text-sm text-default-500">Total Materiales</p>
              <p className="text-2xl font-semibold">{materiales.length}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-2 rounded-full bg-success-100">
              <Icon icon="lucide:users" className="text-success" width={24} height={24} />
            </div>
            <div>
              <p className="text-sm text-default-500">Total Usuarios</p>
              <p className="text-2xl font-semibold">{usuarios.length}</p>
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
            <h4 className="font-bold text-large">Últimos Préstamos</h4>
            <p className="text-tiny text-default-500">Préstamos más recientes</p>
          </CardHeader>
          <CardBody>
            {prestamos.slice(0, 5).map((prestamo) => (
              <div key={prestamo.idPrestamo} className="border-b border-divider py-2 last:border-none">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">ID: {prestamo.materialId}</p>
                    <p className="text-sm text-default-500">Usuario: {prestamo.usuarioId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Fecha: {new Date(prestamo.fechaPrestamo).toLocaleDateString()}</p>
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
              <p className="text-center text-default-500 py-4">No hay préstamos registrados</p>
            )}
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">Últimos Usuarios</h4>
            <p className="text-tiny text-default-500">Usuarios registrados recientemente</p>
          </CardHeader>
          <CardBody>
            {usuarios.slice(0, 5).map((usuario) => (
              <div key={usuario.id} className="border-b border-divider py-2 last:border-none">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{usuario.nombre}</p>
                    <p className="text-sm text-default-500">{usuario.email}</p>
                  </div>
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      usuario.estado === 'ACTIVO' ? 'bg-success-100 text-success-600' : 
                      'bg-danger-100 text-danger-600'
                    }`}>
                      {usuario.estado}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {usuarios.length === 0 && (
              <p className="text-center text-default-500 py-4">No hay usuarios registrados</p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;