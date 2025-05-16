import api from './api';
import { 
  Usuario, 
  Alumno, 
  Docente, 
  Externo, 
  AlumnoRegistrationDTO, 
  DocenteRegistrationDTO, 
  ExternoRegistrationDTO 
} from '../types/usuario';

export const getAllUsuarios = async (): Promise<Usuario[]> => {
  const response = await api.get('/api/usuarios');
  return response.data;
};

export const getUsuarioById = async (id: string): Promise<Usuario> => {
  const response = await api.get(`/api/usuarios/${id}`);
  return response.data;
};

export const createAlumno = async (alumno: AlumnoRegistrationDTO): Promise<Alumno> => {
  const response = await api.post('/api/usuarios/alumno', alumno);
  return response.data;
};

export const createDocente = async (docente: DocenteRegistrationDTO): Promise<Docente> => {
  const response = await api.post('/api/usuarios/docente', docente);
  return response.data;
};

export const createExterno = async (externo: ExternoRegistrationDTO): Promise<Externo> => {
  const response = await api.post('/api/usuarios/externo', externo);
  return response.data;
};

export const updateUsuario = async (id: string, usuario: Usuario): Promise<Usuario> => {
  const response = await api.put(`/api/usuarios/${id}`, usuario);
  return response.data;
};

export const deleteUsuario = async (id: string): Promise<void> => {
  await api.delete(`/api/usuarios/${id}`);
};
