export interface Prestamo {
  idPrestamo: string;
  materialId: string;
  usuarioId: string;
  fechaPrestamo: string;
  fechaDevolucionEsperada: string;
  fechaDevolucionReal?: string;
  estado: PrestamoEstado;
}

export type PrestamoEstado = 'Activo' | 'Devuelto' | 'Vencido';
