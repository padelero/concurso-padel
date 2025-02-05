import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileDataTab } from "@/components/profile/ProfileDataTab";
import { PasswordTab } from "@/components/profile/PasswordTab";
import { RankingTab } from "@/components/profile/RankingTab";

const Profile = () => {
  const navigate = useNavigate();

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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Datos Perfil</TabsTrigger>
              <TabsTrigger value="password">Contraseña</TabsTrigger>
              <TabsTrigger value="ranking">Concurso</TabsTrigger>
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