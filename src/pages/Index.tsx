import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';

export default function LandingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        // Obtener el perfil del usuario de la tabla padelero
        const { data: userProfile, error: profileError } = await supabase
          .from('padelero')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        toast({
          title: "¡Bienvenido de nuevo!",
          description: "Has iniciado sesión correctamente.",
        });

        // Redirigir según el rol del usuario
        if (userProfile.rol === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/profile');
        }

      } else {
        // Register
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            },
          },
        });

        if (authError) throw authError;

        // Create profile in padelero table
        const { error: profileError } = await supabase
          .from('padelero')
          .insert([
            {
              id: authData.user?.id,
              nombre: formData.name,
              email: formData.email,
            },
          ]);

        if (profileError) throw profileError;

        toast({
          title: "¡Registro exitoso!",
          description: "Tu cuenta ha sido creada correctamente.",
        });
      }

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

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado",
        description: "Revisa tu correo para restablecer tu contraseña.",
      });
      setIsResetMode(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al enviar el email de recuperación",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Padelero</h1>
          <p className="text-gray-600 mb-8">Tu plataforma para torneos de pádel</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={isResetMode ? handlePasswordReset : handleSubmit} className="space-y-4">
              {isResetMode ? (
                <>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ingresa tu email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Cargando..." : "Enviar email de recuperación"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setIsResetMode(false)}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-800 w-full text-center"
                  >
                    Volver al inicio de sesión
                  </button>
                </>
              ) : (
                <>
                  {isLogin ? (
                    <>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Ingresa tu email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Cargando..." : "Iniciar sesión"}
                      </Button>
                      <button
                        type="button"
                        onClick={() => setIsResetMode(true)}
                        className="mt-4 text-sm text-blue-600 hover:text-blue-800 w-full text-center"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder="Tu nombre"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="tu@email.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          required
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Procesando...' : 'Registrarse'}
                      </Button>
                    </>
                  )}
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      disabled={isLoading}
                    >
                      {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
