import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  email: string;
  nombre: string | null;
  movil: string | null;
}

export const ProfileDataTab = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [movil, setMovil] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from("padelero")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      if (!data) {
        const { data: newProfile, error: insertError } = await supabase
          .from("padelero")
          .insert([{ email: user.email }])
          .select()
          .single();

        if (insertError) {
          console.error("Error creating profile:", insertError);
          throw insertError;
        }

        setProfile(newProfile);
        setNombre(newProfile.nombre || "");
        setMovil(newProfile.movil || "");
      } else {
        setProfile(data);
        setNombre(data.nombre || "");
        setMovil(data.movil || "");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al cargar el perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from("padelero")
        .update({
          nombre,
          movil,
        })
        .eq("email", user.email);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, nombre, movil } : null);

      toast({
        title: "Éxito",
        description: "Perfil actualizado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al actualizar el perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          type="email"
          value={profile?.email || ""}
          disabled
          className="bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre
        </label>
        <Input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Móvil
        </label>
        <Input
          type="tel"
          value={movil}
          onChange={(e) => setMovil(e.target.value)}
          placeholder="Tu número de móvil"
        />
      </div>
      <Button
        onClick={updateProfile}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Actualizando..." : "Actualizar perfil"}
      </Button>
    </div>
  );
};