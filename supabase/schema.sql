-- ==============================================================================
-- PAUSA - Supabase Schema Migration: User Avatar URL & Storage Setup
-- ==============================================================================

-- 1. Ensure avatar_url column exists in public.profiles without modifying other columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Create public storage bucket 'avatars' for profile pictures if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Security & Access Policies for 'avatars' bucket
-- Public read access so avatars can be loaded seamlessly by the app
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Avatars Access'
  ) THEN
    CREATE POLICY "Public Avatars Access" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'avatars');
  END IF;
END $$;

-- Insert policy for authenticated or anon app users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Avatars Upload Access'
  ) THEN
    CREATE POLICY "Avatars Upload Access" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'avatars');
  END IF;
END $$;

-- Update policy for avatars
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Avatars Update Access'
  ) THEN
    CREATE POLICY "Avatars Update Access" 
    ON storage.objects FOR UPDATE 
    USING (bucket_id = 'avatars');
  END IF;
END $$;

-- Delete policy for avatars
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Avatars Delete Access'
  ) THEN
    CREATE POLICY "Avatars Delete Access" 
    ON storage.objects FOR DELETE 
    USING (bucket_id = 'avatars');
  END IF;
END $$;
