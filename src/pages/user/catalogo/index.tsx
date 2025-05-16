import React from 'react';
import { Card, CardBody, Input, Chip, Pagination, Spinner, Select, SelectItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import { getAllMateriales } from '../../../services/materialesService';
import { Material } from '../../../types/material';

const CatalogoPage: React.FC = () => {
  const [materiales, setMateriales] = React.useState<Material[]>([]);
  const [filteredMateriales, setFilteredMateriales] = React.useState<Material[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterIdioma, setFilterIdioma] = React.useState('todos');
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 9;

  React.useEffect(() => {
    const fetchMateriales = async () => {
      try {
        setIsLoading(true);
        const data = await getAllMateriales();
        setMateriales(data);
        setFilteredMateriales(data);
      } catch (error) {
        console.error('Error al cargar materiales:', error);
        setError('Error al cargar el catálogo. Por favor, intente nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMateriales();
  }, []);

  React.useEffect(() => {
    let filtered = materiales;
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(material => 
        material.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.autor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por idioma
    if (filterIdioma !== 'todos') {
      filtered = filtered.filter(material => material.idioma === filterIdioma);
    }
    
    setFilteredMateriales(filtered);
    setPage(1);
  }, [searchTerm, filterIdioma, materiales]);

  const idiomas = React.useMemo(() => {
    const uniqueIdiomas = new Set(materiales.map(material => material.idioma));
    return ['todos', ...Array.from(uniqueIdiomas)];
  }, [materiales]);

  const pages = Math.ceil(filteredMateriales.length / itemsPerPage);
  const currentItems = React.useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredMateriales.slice(start, end);
  }, [page, filteredMateriales, itemsPerPage]);

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
      <h1 className="text-2xl font-bold mb-6">Catálogo de Materiales</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Buscar por título o autor..."
          value={searchTerm}
          onValueChange={setSearchTerm}
          startContent={<Icon icon="lucide:search" className="text-default-400" />}
          isClearable
          className="w-full md:w-1/2"
        />
        
        <Select 
          label="Filtrar por idioma" 
          value={filterIdioma}
          onChange={(e) => setFilterIdioma(e.target.value)}
          className="w-full md:w-1/4"
        >
          {idiomas.map((idioma) => (
            <SelectItem key={idioma} value={idioma}>
              {idioma === 'todos' ? 'Todos los idiomas' : idioma}
            </SelectItem>
          ))}
        </Select>
      </div>
      
      {filteredMateriales.length === 0 ? (
        <div className="text-center p-8">
          <Icon icon="lucide:search-x" className="mx-auto mb-4 text-default-400" width={48} height={48} />
          <h3 className="text-xl font-semibold mb-2">No se encontraron resultados</h3>
          <p className="text-default-500">
            Intenta con otros términos de búsqueda o filtros diferentes.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((material) => (
              <Card key={material.id} className="hover:shadow-md transition-shadow">
                <CardBody className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon="lucide:book" className="text-primary" />
                    <Chip size="sm" variant="flat">{material.idioma}</Chip>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-1">{material.titulo}</h3>
                  <p className="text-default-500 mb-2">{material.autor}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-default-400">
                      {material.anioPublicacion}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {material.palabrasClave && material.palabrasClave.slice(0, 3).map((palabra, index) => (
                        <Chip key={index} size="sm" variant="flat" color="secondary" className="text-xs">
                          {palabra}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <Pagination 
              total={pages} 
              initialPage={1} 
              page={page}
              onChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CatalogoPage;