import api from './api';
import { Material, Libro, Tesis } from '../types/material';

export const getAllMateriales = async (): Promise<Material[]> => {
  const response = await api.get('/api/materiales');
  return response.data;
};

export const getMaterialById = async (id: string): Promise<Material> => {
  const response = await api.get(`/api/materiales/${id}`);
  return response.data;
};

export const createLibro = async (libro: Omit<Libro, 'id'>): Promise<Libro> => {
  const response = await api.post('/api/materiales/libro', libro);
  return response.data;
};

export const createTesis = async (tesis: Omit<Tesis, 'id'>): Promise<Tesis> => {
  const response = await api.post('/api/materiales/tesis', tesis);
  return response.data;
};

export const updateMaterial = async (id: string, material: Material): Promise<Material> => {
  const response = await api.put(`/api/materiales/${id}`, material);
  return response.data;
};

export const deleteMaterial = async (id: string): Promise<void> => {
  await api.delete(`/api/materiales/${id}`);
};
