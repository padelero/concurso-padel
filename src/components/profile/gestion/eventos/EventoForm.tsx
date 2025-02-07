
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { type Evento } from "../types";
import { type EventoFormData } from "./types";
import { EventoFormField } from "./components/EventoFormField";
import { EventoFormActions } from "./components/EventoFormActions";

type EventoFormProps = {
  evento?: Evento | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export const EventoForm = ({ evento, onSuccess, onCancel }: EventoFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EventoFormData>({
    defaultValues: {
      nombre: "",
      fecha_inicio: "",
      fecha_fin: "",
      descripcion: "",
    },
  });

  useEffect(() => {
    if (evento) {
      form.reset({
        nombre: evento.nombre,
        fecha_inicio: new Date(evento.fecha_inicio).toISOString().slice(0, 16),
        fecha_fin: new Date(evento.fecha_fin).toISOString().slice(0, 16),
        descripcion: evento.descripcion || "",
      });
    }
  }, [evento, form]);

  const onSubmit = async (data: EventoFormData) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (evento) {
        const { error } = await supabase
          .from("eventos")
          .update(data)
          .eq("id", evento.id);

        if (error) throw error;

        toast({
          title: "Evento actualizado",
          description: "El evento se ha actualizado correctamente",
        });
      } else {
        const { error } = await supabase.from("eventos").insert({
          ...data,
          created_by: user?.id,
        });

        if (error) throw error;

        toast({
          title: "Evento creado",
          description: "El evento se ha creado correctamente",
        });
      }

      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error with evento:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo procesar el evento. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <EventoFormField
          form={form}
          name="nombre"
          label="Nombre del Evento"
          placeholder="Nombre del evento"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EventoFormField
            form={form}
            name="fecha_inicio"
            label="Fecha de Inicio"
            type="datetime-local"
          />

          <EventoFormField
            form={form}
            name="fecha_fin"
            label="Fecha de Fin"
            type="datetime-local"
          />
        </div>

        <EventoFormField
          form={form}
          name="descripcion"
          label="Descripción"
          type="textarea"
          placeholder="Descripción del evento"
        />

        <EventoFormActions
          isLoading={isLoading}
          isEditing={!!evento}
          onCancel={onCancel}
        />
      </form>
    </Form>
  );
};
