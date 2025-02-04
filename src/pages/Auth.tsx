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
      console.log("Attempting signup with:", { email }); // Debug log
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (signUpError) {
        console.error("Signup error:", signUpError); // Debug log
        throw signUpError;
      }

      if (data?.user) {
        console.log("User created successfully:", data.user); // Debug log
        
        const { error: padeleroError } = await supabase
          .from("padelero")
          .insert([{ email }]);

        if (padeleroError) {
          console.error("Padelero insert error:", padeleroError); // Debug log
          throw padeleroError;
        }

        toast({
          title: "Registro exitoso",
          description: "Por favor, verifica tu email para continuar.",
        });
      }
    } catch (error: any) {
      console.error("Full error object:", error); // Debug log
      let errorMessage = "Error en el registro";
      
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
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("Attempting signin with:", { email }); // Debug log
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Signin error:", error); // Debug log
        throw error;
      }

      navigate("/profile");
    } catch (error: any) {
      console.error("Full signin error:", error); // Debug log
      let errorMessage = "Error al iniciar sesión";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email o contraseña incorrectos";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
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