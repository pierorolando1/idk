export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  fechaRegistro?: string;
  estado?: string;
}

export interface Alumno extends Usuario {
  codigoMatricula: string;
  escuela: string;
  anioIngreso: number;
  cicloActual: number;
}

export interface Docente extends Usuario {
  codigoDocente: string;
  area: string;
  tipoDeContrato: string;
  gradoAcademico: string;
}

export interface Externo extends Usuario {
  dni: string;
  institucionProcedencia: string;
}

export interface UsuarioRegistrationDTO {
  password: string;
  type: string;
}

export interface AlumnoRegistrationDTO extends UsuarioRegistrationDTO {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  codigoMatricula: string;
  escuela: string;
  anioIngreso: number;
  cicloActual: number;
  type: 'alumno';
}

export interface DocenteRegistrationDTO extends UsuarioRegistrationDTO {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  codigoDocente: string;
  area: string;
  tipoDeContrato: string;
  gradoAcademico: string;
  type: 'docente';
}

export interface ExternoRegistrationDTO extends UsuarioRegistrationDTO {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  dni: string;
  institucionProcedencia: string;
  type: 'externo';
}

export type UsuarioType = 'alumno' | 'docente' | 'externo';
