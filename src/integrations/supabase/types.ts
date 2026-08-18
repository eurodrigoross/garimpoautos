export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      garimpos: {
        Row: {
          access_type: Database["public"]["Enums"]["garimpo_access"]
          attention_points: string[]
          closed_at: string | null
          code: string
          created_at: string
          discount_fipe_percent: number | null
          fipe_value: number | null
          fuel: string | null
          garimpo_note: string | null
          garimpo_value: number | null
          id: string
          internal_agio: number | null
          internal_base_cost: number | null
          location: string | null
          main_image_url: string | null
          market_difference: number | null
          market_value: number | null
          mileage_km: string | null
          positives: string[]
          published: boolean
          published_at: string | null
          status: Database["public"]["Enums"]["garimpo_status"]
          transmission: string | null
          updated_at: string
          vehicle_name: string
          year: string | null
        }
        Insert: {
          access_type?: Database["public"]["Enums"]["garimpo_access"]
          attention_points?: string[]
          closed_at?: string | null
          code: string
          created_at?: string
          discount_fipe_percent?: number | null
          fipe_value?: number | null
          fuel?: string | null
          garimpo_note?: string | null
          garimpo_value?: number | null
          id?: string
          internal_agio?: number | null
          internal_base_cost?: number | null
          location?: string | null
          main_image_url?: string | null
          market_difference?: number | null
          market_value?: number | null
          mileage_km?: string | null
          positives?: string[]
          published?: boolean
          published_at?: string | null
          status?: Database["public"]["Enums"]["garimpo_status"]
          transmission?: string | null
          updated_at?: string
          vehicle_name: string
          year?: string | null
        }
        Update: {
          access_type?: Database["public"]["Enums"]["garimpo_access"]
          attention_points?: string[]
          closed_at?: string | null
          code?: string
          created_at?: string
          discount_fipe_percent?: number | null
          fipe_value?: number | null
          fuel?: string | null
          garimpo_note?: string | null
          garimpo_value?: number | null
          id?: string
          internal_agio?: number | null
          internal_base_cost?: number | null
          location?: string | null
          main_image_url?: string | null
          market_difference?: number | null
          market_value?: number | null
          mileage_km?: string | null
          positives?: string[]
          published?: boolean
          published_at?: string | null
          status?: Database["public"]["Enums"]["garimpo_status"]
          transmission?: string | null
          updated_at?: string
          vehicle_name?: string
          year?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      garimpos_public: {
        Row: {
          access_type: Database["public"]["Enums"]["garimpo_access"] | null
          attention_points: string[] | null
          closed_at: string | null
          code: string | null
          discount_fipe_percent: number | null
          fipe_value: number | null
          fuel: string | null
          garimpo_note: string | null
          garimpo_value: number | null
          id: string | null
          location: string | null
          main_image_url: string | null
          market_difference: number | null
          market_value: number | null
          mileage_km: string | null
          positives: string[] | null
          published_at: string | null
          status: Database["public"]["Enums"]["garimpo_status"] | null
          transmission: string | null
          vehicle_name: string | null
          year: string | null
        }
        Insert: {
          access_type?: Database["public"]["Enums"]["garimpo_access"] | null
          attention_points?: string[] | null
          closed_at?: string | null
          code?: string | null
          discount_fipe_percent?: number | null
          fipe_value?: number | null
          fuel?: string | null
          garimpo_note?: string | null
          garimpo_value?: number | null
          id?: string | null
          location?: string | null
          main_image_url?: string | null
          market_difference?: number | null
          market_value?: number | null
          mileage_km?: string | null
          positives?: string[] | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["garimpo_status"] | null
          transmission?: string | null
          vehicle_name?: string | null
          year?: string | null
        }
        Update: {
          access_type?: Database["public"]["Enums"]["garimpo_access"] | null
          attention_points?: string[] | null
          closed_at?: string | null
          code?: string | null
          discount_fipe_percent?: number | null
          fipe_value?: number | null
          fuel?: string | null
          garimpo_note?: string | null
          garimpo_value?: number | null
          id?: string | null
          location?: string | null
          main_image_url?: string | null
          market_difference?: number | null
          market_value?: number | null
          mileage_km?: string | null
          positives?: string[] | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["garimpo_status"] | null
          transmission?: string | null
          vehicle_name?: string | null
          year?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      garimpo_access: "OPEN" | "PRIME"
      garimpo_status: "AVAILABLE" | "RESERVED" | "CLOSED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      garimpo_access: ["OPEN", "PRIME"],
      garimpo_status: ["AVAILABLE", "RESERVED", "CLOSED"],
    },
  },
} as const
