import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  genero: z.enum(["masculino", "femenino"], {
    required_error: "Debes seleccionar un género",
  }),
  posicion: z.enum(["derecha", "reves"], {
    required_error: "Debes seleccionar una posición",
  }),
  patrocinador: z.string().optional(),
  activo: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

type JugadorFormProps = {
  jugador?: {
    id: string;
    nombre: string;
    genero: string;
    posicion: string;
    patrocinador: string | null;
    activo: boolean;
  } | null;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export const JugadorForm = ({ jugador, onSuccess, onCancel }: JugadorFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      genero: undefined,
      posicion: undefined,
      patrocinador: "",
      activo: true,
    },
  });

  useEffect(() => {
    if (jugador) {
      form.reset({
        nombre: jugador.nombre,
        genero: jugador.genero as "masculino" | "femenino",
        posicion: jugador.posicion as "derecha" | "reves",
        patrocinador: jugador.patrocinador || "",
        activo: jugador.activo,
      });
    }
  }, [jugador, form]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (jugador) {
        const { error } = await supabase
          .from("jugadores")
          .update({
            nombre: data.nombre,
            genero: data.genero,
            posicion: data.posicion,
            patrocinador: data.patrocinador || null,
            activo: data.activo,
          })
          .eq("id", jugador.id);

        if (error) throw error;

        toast({
          title: "Jugador actualizado",
          description: "El jugador se ha actualizado correctamente",
        });
      } else {
        const { error } = await supabase.from("jugadores").insert({
          nombre: data.nombre,
          genero: data.genero,
          posicion: data.posicion,
          patrocinador: data.patrocinador || null,
          activo: data.activo,
          created_by: user?.id,
        });

        if (error) throw error;

        toast({
          title: "Jugador creado",
          description: "El jugador se ha creado correctamente",
        });
      }

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error with player:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo procesar el jugador. Por favor, inténtalo de nuevo.",
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
              <FormLabel>Nombre del Jugador</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del jugador" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="genero"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Género</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el género" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="posicion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posición</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la posición" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="derecha">Derecha</SelectItem>
                    <SelectItem value="reves">Revés</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="patrocinador"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patrocinador</FormLabel>
              <FormControl>
                <Input placeholder="Patrocinador (opcional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="activo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Estado del Jugador
                </FormLabel>
                <div className="text-sm text-muted-foreground">
                  {field.value ? "Activo" : "Inactivo"}
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? "Procesando..." : jugador ? "Actualizar Jugador" : "Crear Jugador"}
          </Button>

          {jugador && (
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                form.reset();
                onCancel?.();
              }}
            >
              Cancelar Edición
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};