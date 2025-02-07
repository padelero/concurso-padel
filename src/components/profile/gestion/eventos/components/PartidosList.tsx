
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Partido } from "../../types";
import { PartidoResultSelector } from "./PartidoResultSelector";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

type PartidosListProps = {
  partidos: Partido[];
  eventoId: string;
  onUpdateResultado: (
    partidoId: string,
    resultado: "2/0" | "2/1" | "1/2" | "0/2" | null
  ) => void;
};

type JugadorInfo = {
  id: string;
  nombre: string;
};

export const PartidosList = ({ partidos, eventoId, onUpdateResultado }: PartidosListProps) => {
  const navigate = useNavigate();
  const [jugadores, setJugadores] = useState<Record<string, JugadorInfo>>({});

  useEffect(() => {
    const fetchJugadores = async () => {
      // Obtener IDs únicos de todos los jugadores
      const jugadoresIds = new Set<string>();
      partidos.forEach(partido => {
        jugadoresIds.add(partido.jugador1d);
        jugadoresIds.add(partido.jugador1i);
        jugadoresIds.add(partido.jugador2d);
        jugadoresIds.add(partido.jugador2i);
      });

      const { data, error } = await supabase
        .from("jugadores")
        .select("id, nombre")
        .in("id", Array.from(jugadoresIds));

      if (error) {
        console.error("Error fetching jugadores:", error);
        return;
      }

      const jugadoresMap: Record<string, JugadorInfo> = {};
      data.forEach(jugador => {
        jugadoresMap[jugador.id] = jugador;
      });

      setJugadores(jugadoresMap);
    };

    if (partidos.length > 0) {
      fetchJugadores();
    }
  }, [partidos]);

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold">Partidos del Evento</h4>
        <Button
          size="sm"
          onClick={() => {
            navigate("/profile", { state: { tab: "gestion", subtab: "partidos", eventoId } });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Añadir Partido
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha Partido</TableHead>
            <TableHead>Fecha Límite Pronóstico</TableHead>
            <TableHead>Pareja 1</TableHead>
            <TableHead>Pareja 2</TableHead>
            <TableHead>Resultado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partidos.map((partido) => (
            <TableRow key={partido.id}>
              <TableCell>{formatDateTime(partido.fecha_partido)}</TableCell>
              <TableCell>{formatDateTime(partido.fecha_limite_pronostico)}</TableCell>
              <TableCell>
                {jugadores[partido.jugador1d]?.nombre || 'Cargando...'} y{' '}
                {jugadores[partido.jugador1i]?.nombre || 'Cargando...'}
              </TableCell>
              <TableCell>
                {jugadores[partido.jugador2d]?.nombre || 'Cargando...'} y{' '}
                {jugadores[partido.jugador2i]?.nombre || 'Cargando...'}
              </TableCell>
              <TableCell>
                <PartidoResultSelector
                  resultado={partido.resultado}
                  onResultadoChange={(resultado) => onUpdateResultado(partido.id, resultado)}
                />
              </TableCell>
            </TableRow>
          ))}
          {partidos.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No hay partidos registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
