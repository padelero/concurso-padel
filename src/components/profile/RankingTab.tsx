import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface RankingEntry {
  email: string;
  total_puntos: number;
  total_pronosticos: number;
}

export const RankingTab = () => {
  const [topPlayers, setTopPlayers] = useState<RankingEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<RankingEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch top 10 players
      const { data: topTen, error: topError } = await supabase
        .from('ranking')
        .select('*')
        .order('total_puntos', { ascending: false })
        .limit(10);

      if (topError) throw topError;

      // Fetch current user's ranking
      const { data: userRank, error: userError } = await supabase
        .from('ranking')
        .select('*')
        .eq('email', user.email)
        .single();

      if (userError && userError.code !== 'PGRST116') throw userError;

      setTopPlayers(topTen || []);
      setCurrentUserRank(userRank);
    } catch (error: any) {
      console.error('Error fetching ranking:', error);
      toast({
        title: "Error",
        description: "Error al cargar el ranking",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando ranking...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Top 10 Jugadores</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Posición</TableHead>
              <TableHead>Jugador</TableHead>
              <TableHead>Puntos</TableHead>
              <TableHead>Pronósticos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topPlayers.map((player, index) => (
              <TableRow key={player.email} className={player.email === currentUserRank?.email ? "bg-muted" : ""}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{player.email}</TableCell>
                <TableCell>{player.total_puntos}</TableCell>
                <TableCell>{player.total_pronosticos}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {currentUserRank && !topPlayers.some(p => p.email === currentUserRank.email) && (
        <div className="mt-8">
          <h4 className="text-md font-medium mb-2">Tu posición</h4>
          <Table>
            <TableBody>
              <TableRow className="bg-muted">
                <TableCell>-</TableCell>
                <TableCell>{currentUserRank.email}</TableCell>
                <TableCell>{currentUserRank.total_puntos}</TableCell>
                <TableCell>{currentUserRank.total_pronosticos}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};