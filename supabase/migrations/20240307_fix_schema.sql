-- Migration correctrice : Aligner le schéma BDD avec le code applicatif
-- À exécuter dans le SQL Editor de Supabase

-- ============================================================
-- TABLE: projects
-- ============================================================
-- 1. Renommer content_html -> description (nom utilisé dans le code)
ALTER TABLE public.projects RENAME COLUMN content_html TO description;

-- 2. Rendre short_description nullable (pas tjrs requis à l'insertion)
ALTER TABLE public.projects ALTER COLUMN short_description DROP NOT NULL;


-- ============================================================
-- TABLE: articles
-- ============================================================
-- 1. Renommer content_html -> content
ALTER TABLE public.articles RENAME COLUMN content_html TO content;

-- 2. Renommer is_published -> published
ALTER TABLE public.articles RENAME COLUMN is_published TO published;

-- 3. Rendre content nullable (TipTap peut envoyer vide au départ)
ALTER TABLE public.articles ALTER COLUMN content DROP NOT NULL;


-- ============================================================
-- TABLE: failures
-- ============================================================
-- 1. Renommer the_fact -> context
ALTER TABLE public.failures RENAME COLUMN the_fact TO context;

-- 2. Renommer the_lesson -> lessons_learned
ALTER TABLE public.failures RENAME COLUMN the_lesson TO lessons_learned;

-- 3. Rendre period nullable
ALTER TABLE public.failures ALTER COLUMN period DROP NOT NULL;


-- ============================================================
-- TABLE: journal_entries
-- ============================================================
-- 1. Renommer mood_tag (text) -> mood_tags (text[]) pour supporter un tableau de tags
ALTER TABLE public.journal_entries RENAME COLUMN mood_tag TO mood_tag_old;
ALTER TABLE public.journal_entries ADD COLUMN mood_tags TEXT[];
-- Migration douce: copie l'ancienne valeur dans le tableau si elle existe
UPDATE public.journal_entries SET mood_tags = ARRAY[mood_tag_old] WHERE mood_tag_old IS NOT NULL;
ALTER TABLE public.journal_entries DROP COLUMN mood_tag_old;


-- ============================================================
-- RLS: Re-vérification policy article (column published)
-- ============================================================
DROP POLICY IF EXISTS "Public read access for articles (published only)" ON public.articles;
CREATE POLICY "Public read access for articles (published only)" ON public.articles 
    FOR SELECT USING (published = true);
