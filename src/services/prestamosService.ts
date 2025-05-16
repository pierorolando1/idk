import api from './api';
import { Prestamo } from '../types/prestamo';

export const getAllPrestamos = async (): Promise<Prestamo[]> => {
  const response = await api.get('/api/prestamos');
  return response.data;
};

export const getPrestamoById = async (id: string): Promise<Prestamo> => {
  const response = await api.get(`/api/prestamos/${id}`);
  return response.data;
};

export const createPrestamo = async (prestamo: Omit<Prestamo, 'idPrestamo'>): Promise<Prestamo> => {
  const response = await api.post('/api/prestamos', prestamo);
  return response.data;
};

export const updatePrestamo = async (id: string, prestamo: Prestamo): Promise<Prestamo> => {
  const response = await api.put(`/api/prestamos/${id}`, prestamo);
  return response.data;
};

export const deletePrestamo = async (id: string): Promise<void> => {
  await api.delete(`/api/prestamos/${id}`);
};

export const getPrestamosByUsuarioId = async (usuarioId: string): Promise<Prestamo[]> => {
  const allPrestamos = await getAllPrestamos();
  return allPrestamos.filter(prestamo => prestamo.usuarioId === usuarioId);
};
