import React from 'react';
import { useHistory } from 'react-router-dom';
import { Card, CardBody, Button, Input, RadioGroup, Radio, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const [userType, setUserType] = React.useState<'usuario' | 'admin'>('usuario');
  const [userId, setUserId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  
  const { login } = useAuth();
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let success;
      
      if (userType === 'usuario') {
        success = await login('usuario', { idUsuario: userId, password });
      } else {
        success = await login('admin', { password });
      }

      if (success) {
        history.push(userType === 'admin' ? '/admin/dashboard' : '/user/dashboard');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (error) {
      setError('Error al iniciar sesión. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardBody className="p-6">
          <div className="flex justify-center mb-6">
            <Icon icon="lucide:book-open" width={48} height={48} className="text-primary" />
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-6">
            Sistema de Biblioteca
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <RadioGroup
              label="Tipo de usuario"
              orientation="horizontal"
              value={userType}
              onValueChange={(value) => setUserType(value as 'usuario' | 'admin')}
            >
              <Radio value="usuario">Usuario</Radio>
              <Radio value="admin">Administrador</Radio>
            </RadioGroup>
            
            {userType === 'usuario' && (
              <Input
                label="ID de Usuario"
                placeholder="Ingrese su ID"
                value={userId}
                onValueChange={setUserId}
                startContent={<Icon icon="lucide:user" className="text-default-400" />}
                isRequired
              />
            )}
            
            <Input
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              type="password"
              value={password}
              onValueChange={setPassword}
              startContent={<Icon icon="lucide:lock" className="text-default-400" />}
              isRequired
            />
            
            {error && (
              <div className="text-danger text-sm mt-2">{error}</div>
            )}
            
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" color="white" /> : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;