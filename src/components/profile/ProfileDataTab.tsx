
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
  email: string;
  nombre: string | null;
  movil: string | null;
  is_admin?: boolean;
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

      // Get the user's profile data
      const { data: profileData, error: profileError } = await supabase
        .from("padelero")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }

      // Get the user's role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (roleError) {
        console.error("Error fetching role:", roleError);
        throw roleError;
      }

      if (!profileData) {
        const { data: newProfile, error: insertError } = await supabase
          .from("padelero")
          .insert([{ 
            id: user.id,
            email: user.email,
            nombre: "",
            movil: ""
          }])
          .select()
          .single();

        if (insertError) {
          console.error("Error creating profile:", insertError);
          throw insertError;
        }

        setProfile({
          ...newProfile,
          is_admin: roleData?.role === 'admin'
        });
        setNombre(newProfile.nombre || "");
        setMovil(newProfile.movil || "");
      } else {
        setProfile({
          ...profileData,
          is_admin: roleData?.role === 'admin'
        });
        setNombre(profileData.nombre || "");
        setMovil(profileData.movil || "");
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
        .eq("id", user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, nombre, movil } : null);

      toast({
        title: "Éxito",
        description: "Perfil actualizado correctamente",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
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
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        {profile?.is_admin && (
          <Badge variant="secondary" className="ml-2">
            Administrador
          </Badge>
        )}
      </div>
      <Input
        type="email"
        value={profile?.email || ""}
        disabled
        className="bg-gray-100"
      />
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
