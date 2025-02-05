import { useState } from "react";
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

type FormData = {
  jugador1d: string;
  jugador1i: string;
  jugador2d: string;
  jugador2i: string;
  fecha_partido: string;
  fecha_limite_pronostico: string;
};

export const GestionTab = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      jugador1d: "",
      jugador1i: "",
      jugador2d: "",
      jugador2i: "",
      fecha_partido: "",
      fecha_limite_pronostico: "",
    },
  });

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

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Pareja 1</h3>
              <FormField
                control={form.control}
                name="jugador1d"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jugador Derecha</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del jugador" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input placeholder="Nombre del jugador" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input placeholder="Nombre del jugador" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input placeholder="Nombre del jugador" {...field} />
                    </FormControl>
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