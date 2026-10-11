/**
 * Hand-written to match supabase/migrations. After you run migrations you can
 * regenerate this with:  npm run typegen
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Faq {
  question: string;
  answer: string;
}

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          body: string | null;
          section: string | null;
          featured_image_url: string | null;
          author_id: string | null;
          category_id: string | null;
          tags: string[] | null;
          faqs: Json | null;
          seo_title: string | null;
          seo_description: string | null;
          seo_keywords: string | null;
          is_published: boolean | null;
          published_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["articles"]["Row"]> & {
          title: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["articles"]["Row"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["categories"]["Row"]> & {
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Row"]>;
        Relationships: [];
      };
      authors: {
        Row: {
          id: string;
          name: string;
          slug: string;
          bio: string | null;
          photo_url: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["authors"]["Row"]> & {
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["authors"]["Row"]>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}

// Convenience row aliases
export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Author = Database["public"]["Tables"]["authors"]["Row"];

// Shapes with joined relations (what queries return)
export type ArticleWithRelations = Article & {
  author: Pick<Author, "id" | "name" | "slug" | "photo_url" | "bio"> | null;
  category: Pick<Category, "id" | "name" | "slug"> | null;
};
