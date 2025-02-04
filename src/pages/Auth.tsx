import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // 1. Crear el usuario en auth.users
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // 2. Crear entrada en la tabla padelero
        const { error: padeleroError } = await supabase
          .from("padelero")
          .insert([{ email }]);

        if (padeleroError) throw padeleroError;

        toast({
          title: "Registro exitoso",
          description: "Por favor, verifica tu email para continuar.",
        });
      }
    } catch (error: any) {
      let errorMessage = "Error en el registro";
      
      // Mensajes de error específicos
      if (error.message.includes("Password should be at least 6 characters")) {
        errorMessage = "La contraseña debe tener al menos 6 caracteres";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "Este email ya está registrado";
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "Email inválido";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error detallado:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate("/profile");
    } catch (error: any) {
      let errorMessage = "Error al iniciar sesión";
      
      // Mensajes de error específicos
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email o contraseña incorrectos";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error detallado:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Accede a tu cuenta
          </h2>
        </div>
        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="password"
                required
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              type="submit"
              onClick={handleSignIn}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Cargando..." : "Iniciar sesión"}
            </Button>
            <Button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Registrarse
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;