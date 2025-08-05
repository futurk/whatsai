export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          is_guest: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          is_guest?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          is_guest?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          vendor: string
          key: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vendor: string
          key: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vendor?: string
          key?: string
          name?: string
          created_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          user_id: string
          name: string
          instructions: string | null
          model: string
          api_key_id: string
          color: string
          tags: string[]
          temperature: number
          max_tokens: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          instructions?: string | null
          model: string
          api_key_id: string
          color?: string
          tags?: string[]
          temperature?: number
          max_tokens?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          instructions?: string | null
          model?: string
          api_key_id?: string
          color?: string
          tags?: string[]
          temperature?: number
          max_tokens?: number
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          agent_id: string
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          agent_id: string
          title: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          agent_id?: string
          title?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          text: string
          sender: string
          type: string
          status: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          text: string
          sender: string
          type?: string
          status?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          text?: string
          sender?: string
          type?: string
          status?: string | null
          image_url?: string | null
          created_at?: string
        }
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