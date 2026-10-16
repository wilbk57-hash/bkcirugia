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
      admin_roles: {
        Row: {
          created_at: string
          id: string
          level: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          level?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_usage: {
        Row: {
          count: number
          created_at: string
          id: string
          kind: string
          updated_at: string
          user_id: string
          window_start: string
        }
        Insert: {
          count?: number
          created_at?: string
          id?: string
          kind: string
          updated_at?: string
          user_id: string
          window_start: string
        }
        Update: {
          count?: number
          created_at?: string
          id?: string
          kind?: string
          updated_at?: string
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      audit_events: {
        Row: {
          created_at: string
          detail: Json | null
          event: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          detail?: Json | null
          event: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          detail?: Json | null
          event?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      book_chunks: {
        Row: {
          book_id: string
          chunk_index: number
          content: string
          created_at: string
          embedding: string
          id: string
          page: number | null
          user_id: string
        }
        Insert: {
          book_id: string
          chunk_index: number
          content: string
          created_at?: string
          embedding: string
          id?: string
          page?: number | null
          user_id: string
        }
        Update: {
          book_id?: string
          chunk_index?: number
          content?: string
          created_at?: string
          embedding?: string
          id?: string
          page?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_chunks_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "user_books"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_cases: {
        Row: {
          completed_at: string | null
          created_at: string
          data_json: Json
          id: string
          title: string
          topic_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          data_json: Json
          id?: string
          title?: string
          topic_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          data_json?: Json
          id?: string
          title?: string
          topic_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          body: string
          created_at: string
          from_admin: boolean
          id: string
          read_at: string | null
          sender_id: string
          student_id: string
        }
        Insert: {
          body: string
          created_at?: string
          from_admin?: boolean
          id?: string
          read_at?: string | null
          sender_id: string
          student_id: string
        }
        Update: {
          body?: string
          created_at?: string
          from_admin?: boolean
          id?: string
          read_at?: string | null
          sender_id?: string
          student_id?: string
        }
        Relationships: []
      }
      feedback_replies: {
        Row: {
          admin_id: string
          created_at: string
          event_id: string
          id: string
          read_at: string | null
          reply: string
          user_id: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          event_id: string
          id?: string
          read_at?: string | null
          reply: string
          user_id: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          event_id?: string
          id?: string
          read_at?: string | null
          reply?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      payment_submissions: {
        Row: {
          admin_note: string
          amount: number
          created_at: string
          decided_at: string | null
          decided_by: string | null
          id: string
          plan: string
          receipt_path: string
          sender_phone: string
          status: string
          user_id: string
        }
        Insert: {
          admin_note?: string
          amount: number
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          plan: string
          receipt_path: string
          sender_phone?: string
          status?: string
          user_id: string
        }
        Update: {
          admin_note?: string
          amount?: number
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          plan?: string
          receipt_path?: string
          sender_phone?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      peer_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          admin_lang: string | null
          country: string | null
          course: string | null
          created_at: string
          email: string
          id: string
          institution: string | null
          name: string
          phone: string | null
          role: string
          status: string
          updated_at: string
          year: string | null
        }
        Insert: {
          admin_lang?: string | null
          country?: string | null
          course?: string | null
          created_at?: string
          email?: string
          id: string
          institution?: string | null
          name?: string
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string
          year?: string | null
        }
        Update: {
          admin_lang?: string | null
          country?: string | null
          course?: string | null
          created_at?: string
          email?: string
          id?: string
          institution?: string | null
          name?: string
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          lang: string
          last_sent_at: string | null
          p256dh: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          lang?: string
          last_sent_at?: string | null
          p256dh: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          lang?: string
          last_sent_at?: string | null
          p256dh?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pwa_installs: {
        Row: {
          app_version: string
          created_at: string
          device_key: string
          display_mode: string | null
          id: string
          installed_at: string
          last_seen_at: string
          platform: string | null
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          app_version?: string
          created_at?: string
          device_key: string
          display_mode?: string | null
          id?: string
          installed_at?: string
          last_seen_at?: string
          platform?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          app_version?: string
          created_at?: string
          device_key?: string
          display_mode?: string | null
          id?: string
          installed_at?: string
          last_seen_at?: string
          platform?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      study_events: {
        Row: {
          created_at: string
          date: string
          description: string | null
          done: boolean
          id: string
          reminder_offset: number
          time: string | null
          title: string
          topic_id: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          done?: boolean
          id?: string
          reminder_offset?: number
          time?: string | null
          title: string
          topic_id?: string | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          done?: boolean
          id?: string
          reminder_offset?: number
          time?: string | null
          title?: string
          topic_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          lesson_step_id: string | null
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          lesson_step_id?: string | null
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          lesson_step_id?: string | null
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_progress: {
        Row: {
          attempts: number
          created_at: string
          id: string
          last_attempt_at: string
          score: number
          topic_id: string
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          id?: string
          last_attempt_at?: string
          score?: number
          topic_id: string
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: number
          created_at?: string
          id?: string
          last_attempt_at?: string
          score?: number
          topic_id?: string
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          paid_until: string
          plan: string
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          id?: string
          paid_until: string
          plan?: string
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          id?: string
          paid_until?: string
          plan?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tutor_messages: {
        Row: {
          client_id: string
          content: string
          created_at: string
          id: string
          message: Json
          role: string
          user_id: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          id?: string
          message?: Json
          role: string
          user_id: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          message?: Json
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tutor_state: {
        Row: {
          cleared_at: string | null
          preferred_name: string
          profile: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          cleared_at?: string | null
          preferred_name?: string
          profile?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          cleared_at?: string | null
          preferred_name?: string
          profile?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_state_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_books: {
        Row: {
          author: string | null
          category: string | null
          chunk_count: number
          created_at: string
          edition: string | null
          file_hash: string | null
          file_name: string | null
          file_path: string
          id: string
          index_error: string | null
          index_status: string
          indexed_at: string | null
          language: string | null
          mime_type: string | null
          ocr_pages_done: number
          ocr_total_pages: number | null
          page_count: number | null
          published: boolean
          size_bytes: number | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          chunk_count?: number
          created_at?: string
          edition?: string | null
          file_hash?: string | null
          file_name?: string | null
          file_path: string
          id?: string
          index_error?: string | null
          index_status?: string
          indexed_at?: string | null
          language?: string | null
          mime_type?: string | null
          ocr_pages_done?: number
          ocr_total_pages?: number | null
          page_count?: number | null
          published?: boolean
          size_bytes?: number | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author?: string | null
          category?: string | null
          chunk_count?: number
          created_at?: string
          edition?: string | null
          file_hash?: string | null
          file_name?: string | null
          file_path?: string
          id?: string
          index_error?: string | null
          index_status?: string
          indexed_at?: string | null
          language?: string | null
          mime_type?: string | null
          ocr_pages_done?: number
          ocr_total_pages?: number | null
          page_count?: number | null
          published?: boolean
          size_bytes?: number | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      chat_directory: {
        Args: never
        Returns: {
          id: string
          name: string
        }[]
      }
      consume_ai_quota: {
        Args: { _kind: string; _limit: number }
        Returns: boolean
      }
      get_payment_info: {
        Args: never
        Returns: {
          key: string
          value: string
        }[]
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_platform_admin: { Args: never; Returns: boolean }
      log_event: {
        Args: { p_detail?: Json; p_event: string }
        Returns: undefined
      }
      match_book_chunks: {
        Args: {
          filter_book_id?: string
          match_count?: number
          query_embedding: string
        }
        Returns: {
          book_id: string
          content: string
          id: string
          page: number
          similarity: number
        }[]
      }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
