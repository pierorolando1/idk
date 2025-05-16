export interface Material {
  id: string;
  titulo: string;
  autor: string;
  anioPublicacion: number;
  idioma: string;
  palabrasClave: string[];
}

export interface Libro extends Material {
  isbn: string;
  ejemplaresDisponibles: number;
  editorial: string;
  numeroPaginas: number;
  genero: string;
}

export interface Tesis extends Material {
  grado: string;
  areaInvestigacion: string;
  universidad: string;
  asesor: string;
}

export type MaterialType = 'libro' | 'tesis';
