import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface Profile {
  email: string;
  nombre: string | null;
  movil: string | null;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [movil, setMovil] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Use maybeSingle() instead of single() to handle the case when no profile exists
      const { data, error } = await supabase
        .from("padelero")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      // If no profile exists, create one
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
      console.error("Full error object:", error);
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
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from("padelero")
        .update({
          nombre,
          movil,
        })
        .eq("email", user.email);

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }

      // Actualizar el estado local después de una actualización exitosa
      setProfile(prev => prev ? { ...prev, nombre, movil } : null);

      toast({
        title: "Éxito",
        description: "Perfil actualizado correctamente",
      });
    } catch (error: any) {
      console.error("Full error object:", error);
      toast({
        title: "Error",
        description: "Error al actualizar el perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Tu Perfil</h2>
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
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
          <div className="flex flex-col space-y-4">
            <Button
              onClick={updateProfile}
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar perfil"}
            </Button>
            <Button
              onClick={handleSignOut}
              variant="outline"
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;