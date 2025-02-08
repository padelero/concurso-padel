import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";

type Jugador = {
  id: string;
  nombre: string;
};

type Evento = {
  id: string;
  nombre: string;
};

type FormData = {
  jugador1d: string;
  jugador1i: string;
  jugador2d: string;
  jugador2i: string;
  fecha_partido: string;
  fecha_limite_pronostico: string;
  evento_id: string;
};

type Partido = {
  id: string;
  jugador1d: Jugador;
  jugador1i: Jugador;
  jugador2d: Jugador;
  jugador2i: Jugador;
  fecha_partido: string;
  fecha_limite_pronostico: string;
  evento: Evento;
  created_at: string;
  resultado: string;
};

export const PartidosTab = () => {
  console.log("Renderizando PartidosTab");
  
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPartido, setEditingPartido] = useState<Partido | null>(null);
  const [selectedEventoId, setSelectedEventoId] = useState<string>("all");

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
    const loadInitialData = async () => {
      console.log("Iniciando carga inicial de datos");
      try {
        setIsLoading(true);
        await Promise.all([
          loadJugadores(),
          loadEventos(),
          loadPartidos()
        ]);
      } catch (error) {
        console.error("Error en la carga inicial:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (editingPartido) {
      // Convertir las fechas UTC a la zona horaria local de Madrid
      const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        // Obtener el offset de Madrid en minutos
        const madridOffset = -date.getTimezoneOffset();
        // Ajustar la fecha sumando la diferencia de offset
        date.setMinutes(date.getMinutes() + madridOffset);
        return date.toISOString().slice(0, 16);
      };

      form.reset({
        jugador1d: editingPartido.jugador1d.id,
        jugador1i: editingPartido.jugador1i.id,
        jugador2d: editingPartido.jugador2d.id,
        jugador2i: editingPartido.jugador2i.id,
        fecha_partido: formatDateForInput(editingPartido.fecha_partido),
        fecha_limite_pronostico: formatDateForInput(editingPartido.fecha_limite_pronostico),
        evento_id: editingPartido.evento.id,
      });
      setShowForm(true);
    }
  }, [editingPartido]);

  useEffect(() => {
    console.log("Evento seleccionado cambiado:", selectedEventoId);
    loadPartidos();
  }, [selectedEventoId]);

  const loadJugadores = async () => {
    console.log("Cargando jugadores...");
    try {
      const { data, error } = await supabase
        .from("jugadores")
        .select("id, nombre")
        .order("nombre");

      if (error) {
        console.error("Error al cargar jugadores:", error);
        throw error;
      }

      console.log("Jugadores cargados:", data?.length || 0);
      setJugadores(data || []);
    } catch (error: any) {
      console.error("Error en loadJugadores:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los jugadores",
        variant: "destructive",
      });
    }
  };

  const loadEventos = async () => {
    console.log("Cargando eventos...");
    try {
      const { data, error } = await supabase
        .from("eventos")
        .select("id, nombre")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar eventos:", error);
        throw error;
      }

      console.log("Eventos cargados:", data?.length || 0);
      setEventos(data || []);
    } catch (error: any) {
      console.error("Error en loadEventos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos",
        variant: "destructive",
      });
    }
  };

  const loadPartidos = async () => {
    try {
      console.log("Iniciando carga de partidos...");
      
      // Obtener los partidos
      let query = supabase
        .from("partidos")
        .select(`
          id,
          jugador1d,
          jugador1i,
          jugador2d,
          jugador2i,
          fecha_partido,
          fecha_limite_pronostico,
          evento_id,
          resultado,
          created_at
        `)
        .order("fecha_partido", { ascending: false });

      // Aplicar filtro por evento si hay uno seleccionado
      if (selectedEventoId && selectedEventoId !== "all") {
        query = query.eq("evento_id", selectedEventoId);
      }

      const { data: partidosData, error: partidosError } = await query;

      if (partidosError) throw partidosError;
      if (!partidosData) {
        console.log("No hay datos de partidos");
        setPartidos([]);
        return;
      }

      console.log("Cargando detalles para", partidosData.length, "partidos");

      // Obtener los datos de los jugadores y eventos
      const partidosConDetalles = await Promise.all(
        partidosData.map(async (partido) => {
          try {
            // Obtener jugadores
            const jugador1d = await supabase
              .from("jugadores")
              .select("id, nombre")
              .eq("id", partido.jugador1d)
              .single();

            const jugador1i = await supabase
              .from("jugadores")
              .select("id, nombre")
              .eq("id", partido.jugador1i)
              .single();

            const jugador2d = await supabase
              .from("jugadores")
              .select("id, nombre")
              .eq("id", partido.jugador2d)
              .single();

            const jugador2i = await supabase
              .from("jugadores")
              .select("id, nombre")
              .eq("id", partido.jugador2i)
              .single();

            const evento = await supabase
              .from("eventos")
              .select("id, nombre")
              .eq("id", partido.evento_id)
              .single();

            if (jugador1d.error || jugador1i.error || jugador2d.error || jugador2i.error || evento.error) {
              console.error("Error en alguna consulta:", {
                j1d: jugador1d.error,
                j1i: jugador1i.error,
                j2d: jugador2d.error,
                j2i: jugador2i.error,
                ev: evento.error
              });
              throw new Error("Error al cargar los detalles del partido");
            }

            return {
              ...partido,
              jugador1d: jugador1d.data,
              jugador1i: jugador1i.data,
              jugador2d: jugador2d.data,
              jugador2i: jugador2i.data,
              evento: evento.data
            };
          } catch (error) {
            console.error("Error procesando partido:", partido.id, error);
            throw error;
          }
        })
      );

      setPartidos(partidosConDetalles);
    } catch (error: any) {
      console.error("Error completo al cargar partidos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los partidos: " + error.message,
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Al enviar, convertimos las fechas locales a UTC
      const toUTCDate = (dateString: string) => {
        const date = new Date(dateString);
        // Restar el offset de Madrid para obtener UTC
        const madridOffset = -date.getTimezoneOffset();
        date.setMinutes(date.getMinutes() - madridOffset);
        return date.toISOString();
      };

      const fechaPartidoUTC = toUTCDate(data.fecha_partido);
      const fechaLimiteUTC = toUTCDate(data.fecha_limite_pronostico);

      if (editingPartido) {
        // Actualizar partido existente
        const { error } = await supabase
          .from("partidos")
          .update({
            jugador1d: data.jugador1d,
            jugador1i: data.jugador1i,
            jugador2d: data.jugador2d,
            jugador2i: data.jugador2i,
            fecha_partido: fechaPartidoUTC,
            fecha_limite_pronostico: fechaLimiteUTC,
            evento_id: data.evento_id,
          })
          .eq('id', editingPartido.id);

        if (error) throw error;

        toast({
          title: "Éxito",
          description: "Partido actualizado correctamente",
        });
      } else {
        // Crear nuevo partido
        const { error } = await supabase.from("partidos").insert([
          {
            jugador1d: data.jugador1d,
            jugador1i: data.jugador1i,
            jugador2d: data.jugador2d,
            jugador2i: data.jugador2i,
            fecha_partido: fechaPartidoUTC,
            fecha_limite_pronostico: fechaLimiteUTC,
            evento_id: data.evento_id,
          },
        ]);

        if (error) throw error;

        toast({
          title: "Éxito",
          description: "Partido creado correctamente",
        });
      }

      form.reset();
      loadPartidos();
      setShowForm(false);
      setEditingPartido(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (partido: Partido) => {
    setEditingPartido(partido);
  };

  const handleDelete = async (partidoId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este partido?')) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("partidos")
        .delete()
        .eq('id', partidoId);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Partido eliminado correctamente",
      });

      loadPartidos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingPartido(null);
    setShowForm(false);
    form.reset();
  };

  const formatDate = (dateString: string) => {
    try {
      // Parseamos la fecha asumiendo que viene en UTC
      const date = new Date(dateString);
      
      // Ajustamos la zona horaria a España (Europe/Madrid)
      return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Madrid'
      }).format(date);
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p>Cargando...</p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Partidos</CardTitle>
                <CardDescription>Listado de todos los partidos</CardDescription>
              </div>
              {!showForm && (
                <Button onClick={() => setShowForm(true)}>
                  Nuevo Partido
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Selector de Eventos */}
            <div className="mb-6">
              <Select
                value={selectedEventoId}
                onValueChange={(value) => setSelectedEventoId(value)}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Seleccionar evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los eventos</SelectItem>
                  {eventos.map((evento) => (
                    <SelectItem key={evento.id} value={evento.id}>
                      {evento.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showForm ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    {editingPartido ? 'Editar Partido' : 'Nuevo Partido'}
                  </h3>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancelar
                  </Button>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="jugador1d"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jugador 1 (Drive)</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar jugador" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {jugadores.map((jugador) => (
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
                            <FormLabel>Jugador 1 (Revés)</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar jugador" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {jugadores.map((jugador) => (
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
                        name="jugador2d"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jugador 2 (Drive)</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar jugador" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {jugadores.map((jugador) => (
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
                            <FormLabel>Jugador 2 (Revés)</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar jugador" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {jugadores.map((jugador) => (
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

                    <div className="grid grid-cols-2 gap-4">
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
                            <FormLabel>Fecha Límite Pronóstico</FormLabel>
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
                      name="evento_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Evento</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar evento" />
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

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Guardando..." : "Guardar Partido"}
                    </Button>
                  </form>
                </Form>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pareja 1</TableHead>
                      <TableHead>Pareja 2</TableHead>
                      <TableHead>Evento</TableHead>
                      <TableHead>Fecha Partido</TableHead>
                      <TableHead>Fecha Límite Pronóstico</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partidos.map((partido) => (
                      <TableRow key={partido.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div>{partido.jugador1d.nombre} (D)</div>
                            <div>{partido.jugador1i.nombre} (R)</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div>{partido.jugador2d.nombre} (D)</div>
                            <div>{partido.jugador2i.nombre} (R)</div>
                          </div>
                        </TableCell>
                        <TableCell>{partido.evento.nombre}</TableCell>
                        <TableCell>{formatDate(partido.fecha_partido)}</TableCell>
                        <TableCell>{formatDate(partido.fecha_limite_pronostico)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(partido)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(partido.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};