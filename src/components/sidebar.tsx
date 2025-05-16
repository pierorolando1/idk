import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface SidebarProps {
  userType: 'usuario' | 'admin' | null;
  currentPath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userType, currentPath }) => {
  const adminLinks = [
    { to: '/admin/dashboard', icon: 'lucide:layout-dashboard', label: 'Dashboard' },
    { to: '/admin/materiales', icon: 'lucide:book', label: 'Materiales' },
    { to: '/admin/usuarios', icon: 'lucide:users', label: 'Usuarios' },
    { to: '/admin/prestamos', icon: 'lucide:clipboard-list', label: 'Préstamos' },
    { to: '/admin/registro-material', icon: 'lucide:file-plus', label: 'Registrar Material' },
    { to: '/admin/registro-usuario', icon: 'lucide:user-plus', label: 'Registrar Usuario' },
    { to: '/admin/registro-prestamo', icon: 'lucide:clipboard-plus', label: 'Registrar Préstamo' },
  ];

  const userLinks = [
    { to: '/user/dashboard', icon: 'lucide:layout-dashboard', label: 'Dashboard' },
    { to: '/user/catalogo', icon: 'lucide:book', label: 'Catálogo' },
    { to: '/user/mis-prestamos', icon: 'lucide:clipboard-list', label: 'Mis Préstamos' },
  ];

  const links = userType === 'admin' ? adminLinks : userLinks;

  return (
    <div className="w-64 bg-content1 border-r border-divider hidden md:block">
      <div className="p-4">
        <div className="space-y-1">
          {links.map((link) => (
            <Link to={link.to} key={link.to}>
              <Button
                variant="flat"
                color={currentPath === link.to ? 'primary' : 'default'}
                className="w-full justify-start mb-1"
                startContent={<Icon icon={link.icon} width={18} height={18} />}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;