
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Evento, Partido } from "./types";
import { PartidosList } from "./eventos/components/PartidosList";

type EventosListProps = {
  eventos: Evento[];
  onEdit: (evento: Evento) => void;
};

export const EventosList = ({ eventos, onEdit }: EventosListProps) => {
  const [openEventos, setOpenEventos] = useState<Record<string, boolean>>({});
  const [partidos, setPartidos] = useState<Record<string, Partido[]>>({});
  const { toast } = useToast();

  const toggleEvento = async (eventoId: string) => {
    if (!openEventos[eventoId] && !partidos[eventoId]) {
      const { data, error } = await supabase
        .from("partidos")
        .select("*")
        .eq("evento_id", eventoId);

      if (error) {
        console.error("Error fetching partidos:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los partidos",
        });
        return;
      }

      setPartidos(prev => ({ ...prev, [eventoId]: data || [] }));
    }
    setOpenEventos(prev => ({ ...prev, [eventoId]: !prev[eventoId] }));
  };

  const updateResultado = async (partidoId: string, eventoId: string, resultado: "2/0" | "2/1" | "1/2" | "0/2" | null) => {
    const { error } = await supabase
      .from("partidos")
      .update({ resultado })
      .eq("id", partidoId);

    if (error) {
      console.error("Error updating resultado:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el resultado",
      });
      return;
    }

    toast({
      title: "Éxito",
      description: "Resultado actualizado correctamente",
    });

    // Actualizar la lista de partidos
    const { data } = await supabase
      .from("partidos")
      .select("*")
      .eq("evento_id", eventoId);

    setPartidos(prev => ({ ...prev, [eventoId]: data || [] }));
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Fecha Inicio</TableHead>
            <TableHead>Fecha Fin</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {eventos.map((evento) => (
            <Collapsible
              key={evento.id}
              open={openEventos[evento.id]}
              onOpenChange={() => toggleEvento(evento.id)}
            >
              <CollapsibleTrigger asChild>
                <TableRow className="cursor-pointer">
                  <TableCell className="flex items-center gap-2">
                    {openEventos[evento.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {evento.nombre}
                  </TableCell>
                  <TableCell>{new Date(evento.fecha_inicio).toLocaleString()}</TableCell>
                  <TableCell>{new Date(evento.fecha_fin).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(evento);
                      }}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <TableRow>
                  <TableCell colSpan={4} className="p-4">
                    <PartidosList
                      partidos={partidos[evento.id] || []}
                      eventoId={evento.id}
                      onUpdateResultado={(partidoId, resultado) => 
                        updateResultado(partidoId, evento.id, resultado)
                      }
                    />
                  </TableCell>
                </TableRow>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
