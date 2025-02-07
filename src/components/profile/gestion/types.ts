
export type Evento = {
  id: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  descripcion: string | null;
};

export type Jugador = {
  id: string;
  nombre: string;
  genero: string;
  posicion: string;
  patrocinador: string | null;
  activo: boolean;
};
