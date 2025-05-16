import React from 'react';
import { useHistory } from 'react-router-dom';
import { Card, CardBody, Button, Input, Select, SelectItem, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { createPrestamo } from '../../../services/prestamosService';
import { getAllMateriales } from '../../../services/materialesService';
import { getAllUsuarios } from '../../../services/usuariosService';
import { Material } from '../../../types/material';
import { Usuario } from '../../../types/usuario';

const RegistroPrestamoPage: React.FC = () => {
  const [materialId, setMaterialId] = React.useState('');
  const [usuarioId, setUsuarioId] = React.useState('');
  const [fechaPrestamo, setFechaPrestamo] = React.useState(new Date().toISOString().split('T')[0]);
  const [fechaDevolucionEsperada, setFechaDevolucionEsperada] = React.useState('');
  
  const [materiales, setMateriales] = React.useState<Material[]>([]);
  const [usuarios, setUsuarios] = React.useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDataLoading, setIsDataLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  
  const history = useHistory();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoading(true);
        const [materialesData, usuariosData] = await Promise.all([
          getAllMateriales(),
          getAllUsuarios()
        ]);
        
        setMateriales(materialesData);
        setUsuarios(usuariosData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos necesarios. Por favor, intente nuevamente.');
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!materialId || !usuarioId || !fechaPrestamo || !fechaDevolucionEsperada) {
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }
    
    try {
      setIsLoading(true);
      
      await createPrestamo({
        materialId,
        usuarioId,
        fechaPrestamo,
        fechaDevolucionEsperada,
        estado: 'Activo'
      });
      
      history.push('/admin/prestamos');
    } catch (error) {
      console.error('Error al registrar préstamo:', error);
      setError('Error al registrar el préstamo. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Registrar Nuevo Préstamo</h1>
        <Button 
          variant="light" 
          startContent={<Icon icon="lucide:arrow-left" />}
          onPress={() => history.push('/admin/prestamos')}
        >
          Volver
        </Button>
      </div>
      
      <Card>
        <CardBody className="p-6">
          {isDataLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select 
                  label="Material" 
                  placeholder="Seleccione un material"
                  isRequired
                  onChange={(e) => setMaterialId(e.target.value)}
                >
                  {materiales.map((material) => (
                    <SelectItem key={material.id} >
                      {material.titulo + " - "+ material.autor}
                    </SelectItem>
                  ))}
                </Select>
                
                <Select 
                  label="Usuario" 
                  placeholder="Seleccione un usuario"
                  value={usuarioId}
                  onChange={(e) => setUsuarioId(e.target.value)}
                  isRequired
                >
                  {usuarios.map((usuario) => (
                    <SelectItem key={usuario.id}>
                      {usuario.nombre+ " - " + usuario.id}
                    </SelectItem>
                  ))}
                </Select>
                
                <Input
                  label="Fecha de Préstamo"
                  type="date"
                  value={fechaPrestamo}
                  onChange={(e) => setFechaPrestamo(e.target.value)}
                  isRequired
                />
                
                <Input
                  label="Fecha de Devolución Esperada"
                  type="date"
                  value={fechaDevolucionEsperada}
                  onChange={(e) => setFechaDevolucionEsperada(e.target.value)}
                  isRequired
                />
              </div>
              
              {error && (
                <div className="text-danger text-sm">{error}</div>
              )}
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="flat" 
                  onClick={() => history.push('/admin/prestamos')}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  color="primary"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner size="sm" color="white" /> : 'Registrar Préstamo'}
                </Button>
              </div>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default RegistroPrestamoPage;
