import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <Icon icon="lucide:alert-circle" className="text-danger mb-4" width={64} height={64} />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Página no encontrada</h2>
      <p className="text-default-500 mb-8 max-w-md">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <Link to="/">
        <Button color="primary" startContent={<Icon icon="lucide:home" />}>
          Volver al inicio
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;