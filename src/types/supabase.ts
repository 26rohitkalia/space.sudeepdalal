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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      education: {
        Row: {
          created_at: string | null
          degree: string
          field: string
          id: number
          institution: string
          order_index: number | null
          type: string
          user_id: string
          year: string
        }
        Insert: {
          created_at?: string | null
          degree: string
          field: string
          id?: number
          institution: string
          order_index?: number | null
          type: string
          user_id: string
          year: string
        }
        Update: {
          created_at?: string | null
          degree?: string
          field?: string
          id?: number
          institution?: string
          order_index?: number | null
          type?: string
          user_id?: string
          year?: string
        }
        Relationships: []
      }
      endorsements: {
        Row: {
          color_class: string | null
          created_at: string | null
          id: number
          image_url: string | null
          linkedin_url: string | null
          name: string
          role: string
          text: string
          user_id: string
        }
        Insert: {
          color_class?: string | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          linkedin_url?: string | null
          name: string
          role: string
          text: string
          user_id: string
        }
        Update: {
          color_class?: string | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          linkedin_url?: string | null
          name?: string
          role?: string
          text?: string
          user_id?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          color_class: string | null
          company: string
          created_at: string | null
          description: string | null
          duration: string
          id: number
          order_index: number | null
          role: string
          user_id: string
        }
        Insert: {
          color_class?: string | null
          company: string
          created_at?: string | null
          description?: string | null
          duration: string
          id?: number
          order_index?: number | null
          role: string
          user_id: string
        }
        Update: {
          color_class?: string | null
          company?: string
          created_at?: string | null
          description?: string | null
          duration?: string
          id?: number
          order_index?: number | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string | null
          done: boolean | null
          id: number
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          done?: boolean | null
          id?: number
          text: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          done?: boolean | null
          id?: number
          text?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          facebook_url: string | null
          headline: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          profile_image: string | null
          resume_file: string | null
          show_facebook: boolean | null
          show_instagram: boolean | null
          show_linkedin: boolean | null
          sub_headline: string | null
          ticker_speed: number | null
          updated_at: string | null
        }
        Insert: {
          facebook_url?: string | null
          headline?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id: string
          instagram_url?: string | null
          linkedin_url?: string | null
          profile_image?: string | null
          resume_file?: string | null
          show_facebook?: boolean | null
          show_instagram?: boolean | null
          show_linkedin?: boolean | null
          sub_headline?: string | null
          ticker_speed?: number | null
          updated_at?: string | null
        }
        Update: {
          facebook_url?: string | null
          headline?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          profile_image?: string | null
          resume_file?: string | null
          show_facebook?: boolean | null
          show_instagram?: boolean | null
          show_linkedin?: boolean | null
          sub_headline?: string | null
          ticker_speed?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
