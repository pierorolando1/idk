import React from 'react';
import { useHistory } from 'react-router-dom';
import { Card, CardBody, Button, Input, Select, SelectItem, Divider, Spinner, Form } from '@heroui/react';
import { Icon } from '@iconify/react';
import { createAlumno, createDocente, createExterno } from '../../../services/usuariosService';
import { UsuarioType } from '../../../types/usuario';

const RegistroUsuarioPage: React.FC = () => {
  const [usuarioType, setUsuarioType] = React.useState<UsuarioType>('alumno');
  const [nombre, setNombre] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [telefono, setTelefono] = React.useState('');
  const [direccion, setDireccion] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  // Campos específicos para alumno
  const [codigoMatricula, setCodigoMatricula] = React.useState('');
  const [escuela, setEscuela] = React.useState('');
  const [anioIngreso, setAnioIngreso] = React.useState('');
  const [cicloActual, setCicloActual] = React.useState('');
  
  // Campos específicos para docente
  const [codigoDocente, setCodigoDocente] = React.useState('');
  const [area, setArea] = React.useState('');
  const [tipoDeContrato, setTipoDeContrato] = React.useState('');
  const [gradoAcademico, setGradoAcademico] = React.useState('');
  
  // Campos específicos para externo
  const [dni, setDni] = React.useState('');
  const [institucionProcedencia, setInstitucionProcedencia] = React.useState('');
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const [errors, setErrors] = React.useState({});
  
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!nombre || !email || !telefono || !direccion || !password) {
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (usuarioType === 'alumno') {
        if (!codigoMatricula || !escuela || !anioIngreso || !cicloActual) {
          setError('Por favor complete todos los campos obligatorios para el alumno.');
          setIsLoading(false);
          return;
        }
        
        await createAlumno({
          nombre,
          email,
          telefono,
          direccion,
          password,
          codigoMatricula,
          escuela,
          anioIngreso: parseInt(anioIngreso),
          cicloActual: parseInt(cicloActual),
          type: 'alumno'
        });
      } else if (usuarioType === 'docente') {
        if (!codigoDocente || !area || !tipoDeContrato || !gradoAcademico) {
          setError('Por favor complete todos los campos obligatorios para el docente.');
          setIsLoading(false);
          return;
        }
        
        await createDocente({
          nombre,
          email,
          telefono,
          direccion,
          password,
          codigoDocente,
          area,
          tipoDeContrato,
          gradoAcademico,
          type: 'docente'
        });
      } else {
        if (!dni || !institucionProcedencia) {
          setError('Por favor complete todos los campos obligatorios para el usuario externo.');
          setIsLoading(false);
          return;
        }
        
        await createExterno({
          nombre,
          email,
          telefono,
          direccion,
          password,
          dni,
          institucionProcedencia,
          type: 'externo'
        });
      }
      
      history.push('/admin/usuarios');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setErrors(error.response?.data || {});
      setError('Error al registrar el usuario. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Registrar Nuevo Usuario</h1>
        <Button 
          variant="light" 
          startContent={<Icon icon="lucide:arrow-left" />}
          onClick={() => history.push('/admin/usuarios')}
        >
          Volver
        </Button>
      </div>
      
      <Card>
        <CardBody className="p-6">
          <Form onSubmit={handleSubmit} className="space-y-6" validationErrors={errors}
          >
            <div className='w-full'>
              <Select 
                label="Tipo de Usuario" 
                value={usuarioType}
                onChange={(e) => setUsuarioType(e.target.value as UsuarioType)}
                isRequired
              >
                <SelectItem key="alumno" >Alumno</SelectItem>
                <SelectItem key="docente">Docente</SelectItem>
                <SelectItem key="externo">Externo</SelectItem>
              </Select>
            </div>
            
            <Divider />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <Input
                label="Nombre Completo"
                name='nombre'
                placeholder="Ingrese el nombre completo"
                value={nombre}
                onValueChange={setNombre}
                isRequired
              />
              
              <Input
                label="Email"
                name='email'
                placeholder="Ingrese el email"
                type="email"
                value={email}
                onValueChange={setEmail}
                isRequired
              />
              
              <Input
                label="Teléfono"
                name='telefono'
                placeholder="Ingrese el teléfono"
                value={telefono}
                onValueChange={setTelefono}
                isRequired
              />
              
              <Input
                label="Dirección"
                name='direccion'
                placeholder="Ingrese la dirección"
                value={direccion}
                onValueChange={setDireccion}
                isRequired
              />
              
              <Input
                label="Contraseña"
                placeholder="Ingrese la contraseña"
                type="password"
                value={password}
                onValueChange={setPassword}
                isRequired
              />
            </div>
            
            {usuarioType === 'alumno' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <Input
                  label="Código de Matrícula"
                  placeholder="Ingrese el código"
                  name='codigoMatricula'
                  value={codigoMatricula}
                  onValueChange={setCodigoMatricula}
                  isRequired
                />
                
                <Input
                  label="Escuela"
                  name='escuela'
                  placeholder="Ingrese la escuela"
                  value={escuela}
                  onValueChange={setEscuela}
                  isRequired
                />
                
                <Input
                  label="Año de Ingreso"
                  name='anioIngreso'
                  placeholder="Ingrese el año"
                  type="number"
                  value={anioIngreso}
                  onValueChange={setAnioIngreso}
                  isRequired
                />
                
                <Input
                name='cicloActual'
                  label="Ciclo Actual"
                  placeholder="Ingrese el ciclo"
                  type="number"
                  value={cicloActual}
                  onValueChange={setCicloActual}
                  isRequired
                />
              </div>
            )}
            
            {usuarioType === 'docente' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <Input
                  label="Código de Docente"
                  name='codigoDocente'
                  placeholder="Ingrese el código"
                  value={codigoDocente}
                  onValueChange={setCodigoDocente}
                  isRequired
                />
                
                <Input
                  label="Área"
                  name='area'
                  placeholder="Ingrese el área"
                  value={area}
                  onValueChange={setArea}
                  isRequired
                />
                
                <Input
                  label="Tipo de Contrato"
                  name='tipoDeContrato'
                  placeholder="Ingrese el tipo de contrato"
                  value={tipoDeContrato}
                  onValueChange={setTipoDeContrato}
                  isRequired
                />
                
                <Input
                  label="Grado Académico"
                  name='gradoAcademico'
                  placeholder="Ingrese el grado académico"
                  value={gradoAcademico}
                  onValueChange={setGradoAcademico}
                  isRequired
                />
              </div>
            )}
            
            {usuarioType === 'externo' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <Input
                  label="DNI"
                  placeholder="Ingrese el DNI"
                  value={dni}
                  onValueChange={setDni}
                  isRequired
                />
                
                <Input
                  label="Institución de Procedencia"
                  placeholder="Ingrese la institución"
                  value={institucionProcedencia}
                  onValueChange={setInstitucionProcedencia}
                  isRequired
                />
              </div>
            )}
            
            {error && (
              <div className="text-danger text-sm">{error}</div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="flat" 
                onClick={() => history.push('/admin/usuarios')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                color="primary"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? <Spinner size="sm" color="white" /> : 'Registrar Usuario'}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default RegistroUsuarioPage;
