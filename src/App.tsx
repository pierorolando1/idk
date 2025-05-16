import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/login';
import AdminDashboard from './pages/admin/dashboard';
import UserDashboard from './pages/user/dashboard';
import MaterialesPage from './pages/admin/materiales';
import UsuariosPage from './pages/admin/usuarios';
import PrestamosPage from './pages/admin/prestamos';
import RegistroMaterialPage from './pages/admin/registro-material';
import RegistroUsuarioPage from './pages/admin/registro-usuario';
import RegistroPrestamoPage from './pages/admin/registro-prestamo';
import MisPrestamosPage from './pages/user/mis-prestamos';
import CatalogoPage from './pages/user/catalogo';
import NotFoundPage from './pages/not-found';
import Layout from './components/layout';

const App: React.FC = () => {
  const { isAuthenticated, userType } = useAuth();

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {isAuthenticated ? (
            <Redirect to={userType === 'admin' ? '/admin/dashboard' : '/user/dashboard'} />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        
        <Route exact path="/login" component={LoginPage} />
        
        {/* Rutas protegidas de administrador */}
        <PrivateRoute 
          path="/admin" 
          isAuthenticated={true}
          redirectTo="/login"
        >
          <Layout>
            <Switch>
              <Route exact path="/admin/dashboard" component={AdminDashboard} />
              <Route exact path="/admin/materiales" component={MaterialesPage} />
              <Route exact path="/admin/usuarios" component={UsuariosPage} />
              <Route exact path="/admin/prestamos" component={PrestamosPage} />
              <Route exact path="/admin/registro-material" component={RegistroMaterialPage} />
              <Route exact path="/admin/registro-usuario" component={RegistroUsuarioPage} />
              <Route exact path="/admin/registro-prestamo" component={RegistroPrestamoPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Layout>
        </PrivateRoute>
        
        {/* Rutas protegidas de usuario */}
        <PrivateRoute 
          path="/user" 
          isAuthenticated={true}
          redirectTo="/login"
        >
          <Layout>
            <Switch>
              <Route exact path="/user/dashboard" component={UserDashboard} />
              <Route exact path="/user/mis-prestamos" component={MisPrestamosPage} />
              <Route exact path="/user/catalogo" component={CatalogoPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Layout>
        </PrivateRoute>
        
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
};

interface PrivateRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  path: string;
  redirectTo: string;
  exact?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  isAuthenticated,
  path,
  redirectTo,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      path={path}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: redirectTo,
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

export default App;
