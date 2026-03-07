-- ============================================================
-- KOUDOUS 2.0 - Supabase Storage RLS Policies
-- À exécuter dans : Supabase > SQL Editor
-- ============================================================

-- 1. Create storage bucket 'images' if it doesn't exist
-- (Sinon, créer le bucket manuellement dans Storage > New Bucket > "images" > Public)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'images',
    'images',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access" ON storage.objects;
DROP POLICY IF EXISTS "Admin update access" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access" ON storage.objects;

-- 3. Allow ANYONE to view/read images publicly
CREATE POLICY "Public read access" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'images');

-- 4. Allow authenticated users (admin) to upload images
CREATE POLICY "Admin upload access" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'images');

-- 5. Allow authenticated users (admin) to update images
CREATE POLICY "Admin update access" ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'images');

-- 6. Allow authenticated users (admin) to delete images
CREATE POLICY "Admin delete access" ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'images');
