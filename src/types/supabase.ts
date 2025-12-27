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
      analytics_visits: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          id: number
          ip_address: string | null
          path: string
          user_agent: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: number
          ip_address?: string | null
          path: string
          user_agent?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: number
          ip_address?: string | null
          path?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: number
          is_read: boolean | null
          is_saved: boolean | null
          message: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          is_read?: boolean | null
          is_saved?: boolean | null
          message: string
          name: string
          phone: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          is_read?: boolean | null
          is_saved?: boolean | null
          message?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
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
      posts: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          image_url: string | null
          is_published: boolean | null
          layout_type: string | null
          published_at: string | null
          show_author: boolean | null
          show_date: boolean | null
          summary: string | null
          title: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          is_published?: boolean | null
          layout_type?: string | null
          published_at?: string | null
          show_author?: boolean | null
          show_date?: boolean | null
          summary?: string | null
          title: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          is_published?: boolean | null
          layout_type?: string | null
          published_at?: string | null
          show_author?: boolean | null
          show_date?: boolean | null
          summary?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          custom_font_url: string | null
          facebook_url: string | null
          font_family: string | null
          headline: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          insights_header_subtitle: string | null
          insights_header_title: string | null
          instagram_url: string | null
          linkedin_url: string | null
          profile_image: string | null
          projects_header_subtitle: string | null
          projects_header_title: string | null
          projects_view_layout: string | null
          resume_file: string | null
          show_facebook: boolean | null
          show_instagram: boolean | null
          show_linkedin: boolean | null
          sub_headline: string | null
          theme: string | null
          ticker_speed: number | null
          updated_at: string | null
        }
        Insert: {
          custom_font_url?: string | null
          facebook_url?: string | null
          font_family?: string | null
          headline?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id: string
          insights_header_subtitle?: string | null
          insights_header_title?: string | null
          instagram_url?: string | null
          linkedin_url?: string | null
          profile_image?: string | null
          projects_header_subtitle?: string | null
          projects_header_title?: string | null
          projects_view_layout?: string | null
          resume_file?: string | null
          show_facebook?: boolean | null
          show_instagram?: boolean | null
          show_linkedin?: boolean | null
          sub_headline?: string | null
          theme?: string | null
          ticker_speed?: number | null
          updated_at?: string | null
        }
        Update: {
          custom_font_url?: string | null
          facebook_url?: string | null
          font_family?: string | null
          headline?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          insights_header_subtitle?: string | null
          insights_header_title?: string | null
          instagram_url?: string | null
          linkedin_url?: string | null
          profile_image?: string | null
          projects_header_subtitle?: string | null
          projects_header_title?: string | null
          projects_view_layout?: string | null
          resume_file?: string | null
          show_facebook?: boolean | null
          show_instagram?: boolean | null
          show_linkedin?: boolean | null
          sub_headline?: string | null
          theme?: string | null
          ticker_speed?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          experience_id: number | null
          id: number
          images: string[] | null
          layout_type: string | null
          long_description: string | null
          order_index: number | null
          short_description: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          experience_id?: number | null
          id?: number
          images?: string[] | null
          layout_type?: string | null
          long_description?: string | null
          order_index?: number | null
          short_description?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          experience_id?: number | null
          id?: number
          images?: string[] | null
          layout_type?: string | null
          long_description?: string | null
          order_index?: number | null
          short_description?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      storage_usage: {
        Row: {
          file_count: number | null
          total_bytes: number | null
        }
        Relationships: []
      }
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
