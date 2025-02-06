import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { type Evento } from "../types";

type FormData = {
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  descripcion: string;
};

type EventoFormProps = {
  evento?: Evento | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export const EventoForm = ({ evento, onSuccess, onCancel }: EventoFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
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

  const onSubmit = async (data: FormData) => {
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
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Evento</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del evento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fecha_inicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Inicio</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fecha_fin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Fin</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descripción del evento"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? "Procesando..." : evento ? "Actualizar Evento" : "Crear Evento"}
          </Button>

          {evento && (
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Cancelar Edición
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};