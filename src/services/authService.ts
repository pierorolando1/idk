import api from './api';

export const loginAsUser = async (credentials: { idUsuario: string; password: string }): Promise<string> => {
  try {
    const response = await api.post('/api/auth/usuario', credentials);
    return credentials.idUsuario; // Devolvemos el ID del usuario
  } catch (error) {
    throw new Error('Credenciales inválidas');
  }
};

export const loginAsAdmin = async (credentials: { password: string }): Promise<void> => {
  try {
    await api.post('/api/auth/admin', credentials);
  } catch (error) {
    throw new Error('Contraseña de administrador incorrecta');
  }
};
