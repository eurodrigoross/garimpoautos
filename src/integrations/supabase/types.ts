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
    PostgrestVersion: "14.5"
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
          sold_at: string | null
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
          sold_at?: string | null
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
          sold_at?: string | null
          status?: Database["public"]["Enums"]["garimpo_status"]
          transmission?: string | null
          updated_at?: string
          vehicle_name?: string
          year?: string | null
        }
        Relationships: []
      }
      memberships: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          plan: string
          starts_at: string
          status: Database["public"]["Enums"]["membership_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["membership_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["membership_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prime_contents: {
        Row: {
          category: string
          content: string
          created_at: string
          excerpt: string | null
          id: string
          published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_deals: {
        Row: {
          acquisition_value: number
          created_at: string
          documentation_cost: number
          fipe_value: number | null
          garimpo_code: string | null
          garimpo_id: string | null
          id: string
          image_url: string | null
          notes: string | null
          other_cost: number
          repair_cost: number
          sale_date: string | null
          sale_notes: string | null
          sale_value: number | null
          source: Database["public"]["Enums"]["user_deal_source"]
          status: Database["public"]["Enums"]["user_deal_status"]
          transport_cost: number
          updated_at: string
          user_id: string
          vehicle_name: string
          year_model: string | null
        }
        Insert: {
          acquisition_value?: number
          created_at?: string
          documentation_cost?: number
          fipe_value?: number | null
          garimpo_code?: string | null
          garimpo_id?: string | null
          id?: string
          image_url?: string | null
          notes?: string | null
          other_cost?: number
          repair_cost?: number
          sale_date?: string | null
          sale_notes?: string | null
          sale_value?: number | null
          source?: Database["public"]["Enums"]["user_deal_source"]
          status?: Database["public"]["Enums"]["user_deal_status"]
          transport_cost?: number
          updated_at?: string
          user_id: string
          vehicle_name: string
          year_model?: string | null
        }
        Update: {
          acquisition_value?: number
          created_at?: string
          documentation_cost?: number
          fipe_value?: number | null
          garimpo_code?: string | null
          garimpo_id?: string | null
          id?: string
          image_url?: string | null
          notes?: string | null
          other_cost?: number
          repair_cost?: number
          sale_date?: string | null
          sale_notes?: string | null
          sale_value?: number | null
          source?: Database["public"]["Enums"]["user_deal_source"]
          status?: Database["public"]["Enums"]["user_deal_status"]
          transport_cost?: number
          updated_at?: string
          user_id?: string
          vehicle_name?: string
          year_model?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
          sold_at: string | null
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
          sold_at?: string | null
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
          sold_at?: string | null
          status?: Database["public"]["Enums"]["garimpo_status"] | null
          transmission?: string | null
          vehicle_name?: string | null
          year?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_prime_member: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      garimpo_access: "OPEN" | "PRIME"
      garimpo_status: "AVAILABLE" | "RESERVED" | "CLOSED" | "SOLD"
      membership_status: "active" | "inactive" | "expired" | "cancelled"
      user_deal_source: "GARIMPO_AUTO" | "MANUAL"
      user_deal_status:
        | "ANALYSIS"
        | "ACQUIRED"
        | "PREPARING"
        | "FOR_SALE"
        | "SOLD"
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
      app_role: ["admin", "moderator", "user"],
      garimpo_access: ["OPEN", "PRIME"],
      garimpo_status: ["AVAILABLE", "RESERVED", "CLOSED", "SOLD"],
      membership_status: ["active", "inactive", "expired", "cancelled"],
      user_deal_source: ["GARIMPO_AUTO", "MANUAL"],
      user_deal_status: [
        "ANALYSIS",
        "ACQUIRED",
        "PREPARING",
        "FOR_SALE",
        "SOLD",
      ],
    },
  },
} as const
