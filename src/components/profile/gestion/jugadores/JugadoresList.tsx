import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Jugador } from "../types";

type JugadoresListProps = {
  jugadores: Jugador[];
  onEdit: (jugador: Jugador) => void;
};

export const JugadoresList = ({ jugadores, onEdit }: JugadoresListProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Género</TableHead>
            <TableHead>Posición</TableHead>
            <TableHead>Patrocinador</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jugadores.map((jugador) => (
            <TableRow key={jugador.id}>
              <TableCell>{jugador.nombre}</TableCell>
              <TableCell>{jugador.genero}</TableCell>
              <TableCell>{jugador.posicion}</TableCell>
              <TableCell>{jugador.patrocinador || "-"}</TableCell>
              <TableCell>{jugador.activo ? "Activo" : "Inactivo"}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(jugador)}
                >
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};