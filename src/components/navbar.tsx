import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarContent, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '../context/AuthContext';

const AppNavbar: React.FC = () => {
  const { userType, logout } = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <Navbar isBordered>
      <NavbarBrand>
        <Link to="/" className="flex items-center gap-2">
          <Icon icon="lucide:book-open" width={24} height={24} />
          <p className="font-bold text-inherit">Sistema de Biblioteca</p>
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform"
              color="primary"
              name={userType === 'admin' ? 'Admin' : 'Usuario'}
              size="sm"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Acciones de perfil">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-bold">
                {userType === 'admin' ? 'Administrador' : 'Usuario'}
              </p>
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
              Cerrar sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};

export default AppNavbar;