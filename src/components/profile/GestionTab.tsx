
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventosTab } from "./gestion/EventosTab";
import { JugadoresTab } from "./gestion/JugadoresTab";
import { PartidosTab } from "./gestion/PartidosTab";

export const GestionTab = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("eventos");

  useEffect(() => {
    const state = location.state as { tab?: string; subtab?: string } | null;
    if (state?.subtab === "partidos") {
      setActiveTab("partidos");
    }
  }, [location]);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
          <TabsTrigger value="jugadores">Jugadores</TabsTrigger>
          <TabsTrigger value="partidos">Partidos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="eventos">
          <EventosTab />
        </TabsContent>
        
        <TabsContent value="jugadores">
          <JugadoresTab />
        </TabsContent>

        <TabsContent value="partidos">
          <PartidosTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
