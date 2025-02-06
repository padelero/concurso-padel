import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartidosTab } from "./PartidosTab";
import { EventoForm } from "./eventos/EventoForm";
import { EventosList } from "./eventos/EventosList";
import type { Evento } from "./types";

export const EventosTab = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);

  const fetchEventos = async () => {
    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .order("fecha_inicio", { ascending: false });

    if (error) {
      console.error("Error fetching eventos:", error);
      return;
    }

    setEventos(data || []);
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  return (
    <Tabs defaultValue="crear" className="space-y-4">
      <TabsList>
        <TabsTrigger value="crear">Crear/Editar Evento</TabsTrigger>
        <TabsTrigger value="lista">Lista de Eventos</TabsTrigger>
        <TabsTrigger value="partidos">Partidos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="crear">
        <EventoForm
          evento={selectedEvento}
          onSuccess={() => {
            setSelectedEvento(null);
            fetchEventos();
          }}
          onCancel={() => setSelectedEvento(null)}
        />
      </TabsContent>
      
      <TabsContent value="lista">
        <EventosList
          eventos={eventos}
          onEdit={setSelectedEvento}
        />
      </TabsContent>
      
      <TabsContent value="partidos">
        <PartidosTab />
      </TabsContent>
    </Tabs>
  );
};