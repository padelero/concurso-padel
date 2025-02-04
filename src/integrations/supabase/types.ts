export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      padelero: {
        Row: {
          email: string
          id: string
          movil: string | null
          nombre: string | null
        }
        Insert: {
          email: string
          id?: string
          movil?: string | null
          nombre?: string | null
        }
        Update: {
          email?: string
          id?: string
          movil?: string | null
          nombre?: string | null
        }
        Relationships: []
      }
      partidos: {
        Row: {
          created_at: string | null
          created_by: string | null
          fecha_limite_pronostico: string
          fecha_partido: string
          id: string
          pareja1: string
          pareja2: string
          resultado: Database["public"]["Enums"]["resultado_tipo"] | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          fecha_limite_pronostico: string
          fecha_partido: string
          id?: string
          pareja1: string
          pareja2: string
          resultado?: Database["public"]["Enums"]["resultado_tipo"] | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          fecha_limite_pronostico?: string
          fecha_partido?: string
          id?: string
          pareja1?: string
          pareja2?: string
          resultado?: Database["public"]["Enums"]["resultado_tipo"] | null
        }
        Relationships: []
      }
      pronosticos: {
        Row: {
          fecha_pronostico: string | null
          id: string
          partido_id: string
          pronostico: Database["public"]["Enums"]["resultado_tipo"]
          puntos: number | null
          usuario_id: string
        }
        Insert: {
          fecha_pronostico?: string | null
          id?: string
          partido_id: string
          pronostico: Database["public"]["Enums"]["resultado_tipo"]
          puntos?: number | null
          usuario_id: string
        }
        Update: {
          fecha_pronostico?: string | null
          id?: string
          partido_id?: string
          pronostico?: Database["public"]["Enums"]["resultado_tipo"]
          puntos?: number | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pronosticos_partido_id_fkey"
            columns: ["partido_id"]
            isOneToOne: false
            referencedRelation: "partidos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      ranking: {
        Row: {
          email: string | null
          total_pronosticos: number | null
          total_puntos: number | null
          usuario_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      resultado_tipo: "2/0" | "2/1" | "1/2" | "0/2"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never