
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

export type Partido = {
  id: string;
  fecha_partido: string;
  fecha_limite_pronostico: string;
  jugador1d: string;
  jugador1i: string;
  jugador2d: string;
  jugador2i: string;
  resultado: "2/0" | "2/1" | "1/2" | "0/2" | null;
  evento_id: string | null;
};

