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
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormData = {
  jugador1d: string;
  jugador1i: string;
  jugador2d: string;
  jugador2i: string;
  fecha_partido: string;
  fecha_limite_pronostico: string;
  evento_id: string;
};

type Jugador = {
  id: string;
  nombre: string;
  posicion: string;
};

type Evento = {
  id: string;
  nombre: string;
};

export const PartidosTab = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);

  const form = useForm<FormData>({
    defaultValues: {
      jugador1d: "",
      jugador1i: "",
      jugador2d: "",
      jugador2i: "",
      fecha_partido: "",
      fecha_limite_pronostico: "",
      evento_id: "",
    },
  });

  useEffect(() => {
    const fetchJugadores = async () => {
      const { data, error } = await supabase
        .from("jugadores")
        .select("id, nombre, posicion")
        .eq("activo", true);

      if (error) {
        console.error("Error fetching jugadores:", error);
        return;
      }

      setJugadores(data || []);
    };

    const fetchEventos = async () => {
      const { data, error } = await supabase
        .from("eventos")
        .select("id, nombre");

      if (error) {
        console.error("Error fetching eventos:", error);
        return;
      }

      setEventos(data || []);
    };

    fetchJugadores();
    fetchEventos();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from("partidos").insert({
        ...data,
        created_by: user?.id,
      });

      if (error) throw error;

      toast({
        title: "Partido creado",
        description: "El partido se ha creado correctamente",
      });

      form.reset();
    } catch (error) {
      console.error("Error creating match:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el partido. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const jugadoresPorPosicion = (posicion: string) => {
    return jugadores.filter(j => j.posicion === posicion);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="evento_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el evento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {eventos.map((evento) => (
                      <SelectItem key={evento.id} value={evento.id}>
                        {evento.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Pareja 1</h3>
              <FormField
                control={form.control}
                name="jugador1d"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jugador Derecha</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el jugador" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jugadoresPorPosicion("derecha").map((jugador) => (
                          <SelectItem key={jugador.id} value={jugador.id}>
                            {jugador.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jugador1i"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jugador Izquierda</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el jugador" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jugadoresPorPosicion("reves").map((jugador) => (
                          <SelectItem key={jugador.id} value={jugador.id}>
                            {jugador.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Pareja 2</h3>
              <FormField
                control={form.control}
                name="jugador2d"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jugador Derecha</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el jugador" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jugadoresPorPosicion("derecha").map((jugador) => (
                          <SelectItem key={jugador.id} value={jugador.id}>
                            {jugador.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jugador2i"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jugador Izquierda</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el jugador" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jugadoresPorPosicion("reves").map((jugador) => (
                          <SelectItem key={jugador.id} value={jugador.id}>
                            {jugador.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fecha_partido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha del Partido</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fecha_limite_pronostico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha Límite de Pronóstico</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creando partido..." : "Crear Partido"}
          </Button>
        </form>
      </Form>
    </div>
  );
};