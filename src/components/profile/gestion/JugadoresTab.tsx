import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JugadorForm } from "./jugadores/JugadorForm";
import { JugadoresList } from "./jugadores/JugadoresList";
import type { Jugador } from "./types";

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
        <JugadoresList
          jugadores={jugadores}
          onEdit={setSelectedJugador}
        />
      </TabsContent>
    </Tabs>
  );
};