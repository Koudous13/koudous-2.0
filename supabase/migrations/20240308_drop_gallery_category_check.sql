-- Drop the restrictive check constraint on gallery.category
-- so that any category label can be stored (French or otherwise)
ALTER TABLE public.gallery DROP CONSTRAINT IF EXISTS gallery_category_check;
