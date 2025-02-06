import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartidosTab } from "./PartidosTab";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FormData = {
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  descripcion: string;
};

type Evento = {
  id: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  descripcion: string | null;
};

export const EventosTab = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);

  const form = useForm<FormData>({
    defaultValues: {
      nombre: "",
      fecha_inicio: "",
      fecha_fin: "",
      descripcion: "",
    },
  });

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

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (selectedEvento) {
        const { error } = await supabase
          .from("eventos")
          .update(data)
          .eq("id", selectedEvento.id);

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
      setSelectedEvento(null);
      fetchEventos();
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

  const handleEdit = (evento: Evento) => {
    setSelectedEvento(evento);
    form.reset({
      nombre: evento.nombre,
      fecha_inicio: new Date(evento.fecha_inicio).toISOString().slice(0, 16),
      fecha_fin: new Date(evento.fecha_fin).toISOString().slice(0, 16),
      descripcion: evento.descripcion || "",
    });
  };

  return (
    <Tabs defaultValue="crear" className="space-y-4">
      <TabsList>
        <TabsTrigger value="crear">Crear/Editar Evento</TabsTrigger>
        <TabsTrigger value="lista">Lista de Eventos</TabsTrigger>
        <TabsTrigger value="partidos">Partidos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="crear">
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Procesando..." : selectedEvento ? "Actualizar Evento" : "Crear Evento"}
            </Button>

            {selectedEvento && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedEvento(null);
                  form.reset();
                }}
              >
                Cancelar Edición
              </Button>
            )}
          </form>
        </Form>
      </TabsContent>
      
      <TabsContent value="lista">
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
                <TableRow key={evento.id}>
                  <TableCell>{evento.nombre}</TableCell>
                  <TableCell>{new Date(evento.fecha_inicio).toLocaleString()}</TableCell>
                  <TableCell>{new Date(evento.fecha_fin).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(evento)}
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
      
      <TabsContent value="partidos">
        <PartidosTab />
      </TabsContent>
    </Tabs>
  );
};