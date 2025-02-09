import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';

export default function LandingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

        toast({
          title: "Bienvenido",
          description: "Has iniciado sesión correctamente.",
        });
        navigate("/profile");
      } else {
        // Register
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "Registro exitoso",
          description: "Por favor verifica tu email para continuar.",
        });
        setIsLogin(true);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex justify-between items-center p-6 bg-white shadow-md">
        <h1 className="text-xl font-bold text-gray-800">ConcursoPádel</h1>
        <Button onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-800">
          Iniciar Sesión
        </Button>
      </header>
      <main className="max-w-4xl mx-auto py-12 px-6">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">¿Eres tan fan del pádel como para predecir los resultados? ¡Demuéstralo en ConcursoPádel!</h2>
          <p className="text-lg text-gray-700">El lugar donde los amantes del pádel se convierten en expertos pronosticadores. Participa, compite y demuestra que sabes más que nadie de este deporte.</p>
          <Button onClick={() => navigate('/register')} className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700">
            ¡Quiero Participar!
          </Button>
        </section>
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-4">¿Qué es ConcursoPádel?</h3>
          <p className="text-gray-700">Donde la pasión por el pádel se convierte en competencia. ConcursoPádel no es solo una quiniela. Es una experiencia única para los que viven y respiran pádel. Cada partido es una nueva oportunidad para demostrar tu conocimiento, competir con otros fans y disfrutar de la emoción de acertar los resultados.</p>
          <p className="text-gray-700 mt-4">Aquí no hay lugar para el azar. Solo cuenta tu intuición, tu experiencia y tu amor por este deporte. ¿Estás listo para aceptar el desafío?</p>
        </section>
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-4">¿Cómo Funciona?</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>Regístrate: Solo necesitas tu nombre, email y tu pasión por el pádel.</li>
            <li>Pronostica: Antes de cada partido, elige el resultado que crees que será: ¿2/0 o 2/1?</li>
            <li>Gana puntos: Si aciertas el resultado exacto, sumas 5 puntos. Si aciertas la pareja ganadora, sumas 2.</li>
            <li>Sube en el ranking: Demuestra que eres el mejor pronosticador y llega a lo más alto.</li>
          </ul>
          <p className="text-gray-700 mt-4">No se trata solo de ganar, se trata de disfrutar cada partido como si estuvieras en la pista.</p>
        </section>
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-4">¿Por Qué Participar?</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>Demuestra tu conocimiento: ¿Eres de los que saben cómo terminará un partido antes de que empiece? ¡Demuéstralo!</li>
            <li>Conéctate con otros fans: Comparte tu pasión con una comunidad que vive el pádel como tú.</li>
            <li>Disfruta de la competencia: Cada pronóstico es una nueva oportunidad para superarte y demostrar que eres el mejor.</li>
          </ul>
          <p className="text-gray-700 mt-4">No importa si eres un experto o un aficionado. Lo que importa es que amas el pádel tanto como nosotros.</p>
        </section>
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-4">Testimonios</h3>
          <blockquote className="text-gray-700 italic mb-4">"ConcursoPádel me ha hecho disfrutar aún más de cada partido. ¡Es adictivo intentar acertar los resultados!" — Laura M., participante desde 2022.</blockquote>
          <blockquote className="text-gray-700 italic mb-4">"Me encanta competir con mis amigos para ver quién acierta más resultados. ¡Es la forma perfecta de unir pasión y diversión!" — Sergio F., fan del pádel.</blockquote>
          <blockquote className="text-gray-700 italic">"Participar en ConcursoPádel es como estar en la pista, pero desde casa. ¡La emoción es la misma!" — Ana L., amante del pádel.</blockquote>
        </section>
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-4">La Comunidad Pádelera</h3>
          <p className="text-gray-700">Un espacio para los que amamos el pádel. En ConcursoPádel no solo compites por puntos, sino que formas parte de una comunidad que comparte tu misma pasión. Aquí encontrarás:</p>
          <ul className="list-disc list-inside text-gray-700 mt-4">
            <li>Amigos: Conéctate con otros fans del pádel.</li>
            <li>Diversión: Disfruta de la emoción de cada partido.</li>
            <li>Competencia sana: Demuestra quién es el mejor pronosticador.</li>
          </ul>
          <p className="text-gray-700 mt-4">Porque el pádel es mejor cuando se comparte.</p>
        </section>
      </main>
      <footer className="bg-white py-6 text-center">
        <p className="text-gray-700">ConcursoPádel: Donde la pasión por el pádel se convierte en competencia. Un proyecto creado por y para los amantes del pádel. Cada partido es una historia. Cada pronóstico, una emoción.</p>
        <p className="text-gray-700 mt-4">¿A qué esperas? ¡Únete a la comunidad pádelera más divertida!</p>
      </footer>
    </div>
  );
}
