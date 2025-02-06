import { useState, useEffect } from "react";
import { JugadorForm } from "./jugadores/JugadorForm";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Jugador = {
  id: string;
  nombre: string;
  genero: string;
  posicion: string;
  patrocinador: string | null;
  activo: boolean;
};

export const JugadoresTab = () => {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [selectedJugador, setSelectedJugador] = useState<Jugador | null>(null);

  const fetchJugadores = async () => {
    const { data, error } = await supabase
      .from("jugadores")
      .select("*")
      .order("nombre");

    if (error) {
      console.error("Error fetching jugadores:", error);
      return;
    }

    setJugadores(data || []);
  };

  useEffect(() => {
    fetchJugadores();
  }, []);

  return (
    <Tabs defaultValue="crear" className="space-y-4">
      <TabsList>
        <TabsTrigger value="crear">Crear/Editar Jugador</TabsTrigger>
        <TabsTrigger value="lista">Lista de Jugadores</TabsTrigger>
      </TabsList>

      <TabsContent value="crear">
        <JugadorForm 
          jugador={selectedJugador}
          onSuccess={() => {
            setSelectedJugador(null);
            fetchJugadores();
          }}
          onCancel={() => setSelectedJugador(null)}
        />
      </TabsContent>

      <TabsContent value="lista">
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
                      onClick={() => setSelectedJugador(jugador)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  );
};