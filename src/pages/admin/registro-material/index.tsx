import React from 'react';
import { useHistory } from 'react-router-dom';
import { Card, CardBody, Button, Input, Textarea, Select, SelectItem, Divider, Spinner, Form } from '@heroui/react';
import { Icon } from '@iconify/react';
import { createLibro, createTesis } from '../../../services/materialesService';
import { MaterialType } from '../../../types/material';

const RegistroMaterialPage: React.FC = () => {
  const [materialType, setMaterialType] = React.useState<MaterialType>('libro');
  const [titulo, setTitulo] = React.useState('');
  const [autor, setAutor] = React.useState('');
  const [anioPublicacion, setAnioPublicacion] = React.useState('');
  const [idioma, setIdioma] = React.useState('');
  const [palabrasClave, setPalabrasClave] = React.useState('');
  
  // Campos específicos para libro
  const [isbn, setIsbn] = React.useState('');
  const [ejemplaresDisponibles, setEjemplaresDisponibles] = React.useState('');
  const [editorial, setEditorial] = React.useState('');
  const [numeroPaginas, setNumeroPaginas] = React.useState('');
  const [genero, setGenero] = React.useState('');
  
  // Campos específicos para tesis
  const [grado, setGrado] = React.useState('');
  const [areaInvestigacion, setAreaInvestigacion] = React.useState('');
  const [universidad, setUniversidad] = React.useState('');
  const [asesor, setAsesor] = React.useState('');
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const [errors, setErrors] = React.useState<any>({});
  
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!titulo || !autor || !anioPublicacion || !idioma) {
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const palabrasClaveArray = palabrasClave
        .split(',')
        .map(palabra => palabra.trim())
        .filter(palabra => palabra !== '');
      
      if (materialType === 'libro') {
        if (!isbn || !ejemplaresDisponibles || !editorial || !numeroPaginas || !genero) {
          setError('Por favor complete todos los campos obligatorios para el libro.');
          setIsLoading(false);
          return;
        }
        
        await createLibro({
          titulo,
          autor,
          anioPublicacion: parseInt(anioPublicacion),
          idioma,
          palabrasClave: palabrasClaveArray,
          isbn,
          ejemplaresDisponibles: parseInt(ejemplaresDisponibles),
          editorial,
          numeroPaginas: parseInt(numeroPaginas),
          genero
        });
      } else {
        if (!grado || !areaInvestigacion || !universidad || !asesor) {
          setError('Por favor complete todos los campos obligatorios para la tesis.');
          setIsLoading(false);
          return;
        }
        
        await createTesis({
          titulo,
          autor,
          anioPublicacion: parseInt(anioPublicacion),
          idioma,
          palabrasClave: palabrasClaveArray,
          grado,
          areaInvestigacion,
          universidad,
          asesor
        });
      }
      
      history.push('/admin/materiales');
    } catch (error) {
      console.error('Error al registrar material:', error.response.data);

      setErrors(error.response.data);
      
      setError('Error al registrar el material. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Registrar Nuevo Material</h1>
        <Button 
          variant="light" 
          startContent={<Icon icon="lucide:arrow-left" />}
          onClick={() => history.push('/admin/materiales')}
        >
          Volver
        </Button>
      </div>
      
      <Card>
        <CardBody className="p-6">
          <Form validationErrors={errors} onSubmit={handleSubmit} className="space-y-6">
            <div className='w-full'>
              <Select 
                label="Tipo de Material" 
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value as MaterialType)}
                isRequired
              >
                <SelectItem key="libro" value="libro">Libro</SelectItem>
                <SelectItem key="tesis" value="tesis">Tesis</SelectItem>
              </Select>
            </div>
            
            <Divider />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <Input
                label="Título"
                name='titulo'
                placeholder="Ingrese el título"
                value={titulo}
                onValueChange={setTitulo}
                isRequired
              />
              
              <Input
                label="Autor"
                name='autor'
                placeholder="Ingrese el autor"
                value={autor}
                onValueChange={setAutor}
                isRequired
              />
              
              <Input
                label="Año de Publicación"
                name='anioPublicacion'
                placeholder="Ingrese el año"
                type="number"
                value={anioPublicacion}
                onValueChange={setAnioPublicacion}
                isRequired
              />
              
              <Input
                label="Idioma"
                name='idioma'
                placeholder="Ingrese el idioma"
                value={idioma}
                onValueChange={setIdioma}
                isRequired
              />
              
              <Textarea
                label="Palabras Clave"
                name='palabrasClave'
                placeholder="Ingrese palabras clave separadas por comas"
                value={palabrasClave}
                onValueChange={setPalabrasClave}
                className="md:col-span-2"
              />
            </div>
            
            {materialType === 'libro' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <Input
                  label="ISBN"
                  name='isbn'
                  placeholder="Ingrese el ISBN"
                  value={isbn}
                  onValueChange={setIsbn}
                  isRequired
                />
                
                <Input
                  label="Ejemplares Disponibles"
                  placeholder="Ingrese la cantidad"
                  name='ejemplaresDisponibles'
                  type="number"
                  value={ejemplaresDisponibles}
                  onValueChange={setEjemplaresDisponibles}
                  isRequired
                />
                
                <Input
                  label="Editorial"
                  name='editorial'
                  placeholder="Ingrese la editorial"
                  value={editorial}
                  onValueChange={setEditorial}
                  isRequired
                />
                
                <Input
                  name='numeroPaginas'
                  label="Número de Páginas"
                  placeholder="Ingrese el número de páginas"
                  type="number"
                  value={numeroPaginas}
                  onValueChange={setNumeroPaginas}
                  isRequired
                />
                
                <Input
                  label="Género"
                  name='genero'
                  placeholder="Ingrese el género"
                  value={genero}
                  onValueChange={setGenero}
                  isRequired
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <Input
                  label="Grado"
                  name='grado'
                  placeholder="Ingrese el grado académico"
                  value={grado}
                  onValueChange={setGrado}
                  isRequired
                />
                
                <Input
                  name='areaInvestigacion'
                  label="Área de Investigación"
                  placeholder="Ingrese el área"
                  value={areaInvestigacion}
                  onValueChange={setAreaInvestigacion}
                  isRequired
                />
                
                <Input
                  name='universidad'
                  label="Universidad"
                  placeholder="Ingrese la universidad"
                  value={universidad}
                  onValueChange={setUniversidad}
                  isRequired
                />
                
                <Input
                name='asesor'
                  label="Asesor"
                  placeholder="Ingrese el nombre del asesor"
                  value={asesor}
                  onValueChange={setAsesor}
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
                onClick={() => history.push('/admin/materiales')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                color="primary"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? <Spinner size="sm" color="white" /> : 'Registrar Material'}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default RegistroMaterialPage;
