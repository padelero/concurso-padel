import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventosTab } from "./gestion/EventosTab";
import { JugadoresTab } from "./gestion/JugadoresTab";

export const GestionTab = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="eventos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
          <TabsTrigger value="jugadores">Jugadores</TabsTrigger>
        </TabsList>
        
        <TabsContent value="eventos">
          <EventosTab />
        </TabsContent>
        
        <TabsContent value="jugadores">
          <JugadoresTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};