
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileDataTab } from "@/components/profile/ProfileDataTab";
import { PasswordTab } from "@/components/profile/PasswordTab";
import { RankingTab } from "@/components/profile/RankingTab";
import { GestionTab } from "@/components/profile/GestionTab";
import { useState, useEffect } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      setIsAdmin(roleData?.role === 'admin');
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Tu Perfil</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-4' : 'grid-cols-3'}`}>
              <TabsTrigger value="profile">Datos Perfil</TabsTrigger>
              <TabsTrigger value="password">Contraseña</TabsTrigger>
              <TabsTrigger value="ranking">Concurso</TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="gestion">Gestión</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="profile">
              <ProfileDataTab />
            </TabsContent>
            <TabsContent value="password">
              <PasswordTab />
            </TabsContent>
            <TabsContent value="ranking">
              <RankingTab />
            </TabsContent>
            {isAdmin && (
              <TabsContent value="gestion">
                <GestionTab />
              </TabsContent>
            )}
          </Tabs>
          
          <div className="mt-6 pt-6 border-t">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
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
