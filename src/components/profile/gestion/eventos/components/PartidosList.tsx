
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

type PartidosListProps = {
  partidos: Partido[];
  eventoId: string;
  onUpdateResultado: (
    partidoId: string,
    resultado: "2/0" | "2/1" | "1/2" | "0/2" | null
  ) => void;
};

export const PartidosList = ({ partidos, eventoId, onUpdateResultado }: PartidosListProps) => {
  const navigate = useNavigate();

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
            <TableHead>Fecha</TableHead>
            <TableHead>Pareja 1</TableHead>
            <TableHead>Pareja 2</TableHead>
            <TableHead>Resultado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partidos.map((partido) => (
            <TableRow key={partido.id}>
              <TableCell>{new Date(partido.fecha_partido).toLocaleString()}</TableCell>
              <TableCell>
                Jugador 1D vs Jugador 1I
              </TableCell>
              <TableCell>
                Jugador 2D vs Jugador 2I
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
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No hay partidos registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
