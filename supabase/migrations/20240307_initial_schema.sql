-- Migration : Mettre en place la BDD KOUDOUS 2.0

-- =====================================================================
-- 1. EXTENSIONS
-- =====================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 2. TABLES GLOBALES (Site Settings / Stats)
-- =====================================================================
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hero_text TEXT NOT NULL DEFAULT 'Je construis des systèmes intelligents.',
    total_projects INT DEFAULT 0,
    total_articles INT DEFAULT 0,
    total_workflows INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Init de la ligne unique
INSERT INTO public.site_settings (hero_text) VALUES ('Je construis des systèmes intelligents et des architectures d''automatisation de pointe. L''excellence technique pure, sans compromis.');

-- =====================================================================
-- 3. PARCOURS (Timeline)
-- =====================================================================
CREATE TABLE public.timeline_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    period VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    category VARCHAR(50) CHECK (category IN ('Académique', 'Personnel', 'Professionnel')),
    image_url TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- 4. RÉALISATIONS (Projets)
-- =====================================================================
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    short_description TEXT NOT NULL,
    content_html TEXT,
    cover_image TEXT,
    metrics JSONB, -- Ex: {"Inference": "12ms", "Rows": "20M"}
    stack_tags TEXT[], -- Ex: ['Python', 'LangChain', 'PostgreSQL']
    is_pro BOOLEAN DEFAULT TRUE,
    github_link TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- 5. ARTICLES (Blog / Journal de Bord)
-- =====================================================================
CREATE TABLE public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL, -- Si lié à un projet (30 days build)
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content_html TEXT NOT NULL,
    cover_image TEXT,
    category VARCHAR(100), -- 'IA/Data', 'Automation', 'Vibe Coding', 'Logs'
    reading_time_minutes INT DEFAULT 5,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- 6. GALERIE
-- =====================================================================
CREATE TABLE public.gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(50) CHECK (category IN ('Work', 'Life', 'Events')),
    capture_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- 7. ÉCHECS (Leçons de guerre)
-- =====================================================================
CREATE TABLE public.failures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    period VARCHAR(100) NOT NULL,
    the_fact TEXT NOT NULL,
    the_lesson TEXT NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- 8. MES JOURNÉES (Microblogging)
-- =====================================================================
CREATE TABLE public.journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    mood_tag VARCHAR(50), -- Ex: #VibeCoding
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- =====================================================================
-- On active le RLS partout
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Les données sont lisibles par tout le monde (Public)
CREATE POLICY "Public read access for site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read access for timeline_steps" ON public.timeline_steps FOR SELECT USING (true);
CREATE POLICY "Public read access for projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read access for articles (published only)" ON public.articles FOR SELECT USING (is_published = true);
CREATE POLICY "Public read access for gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public read access for failures" ON public.failures FOR SELECT USING (true);
CREATE POLICY "Public read access for journal_entries" ON public.journal_entries FOR SELECT USING (true);

-- Seul l'admin authentifié (auth.uid()) peut insérer, modifier ou supprimer
-- => Configuration simplifiée pour démarrer : si auth.uid() NOT NULL, on a les droits admins
CREATE POLICY "Admin write access for site_settings" ON public.site_settings FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin write access for timeline_steps" ON public.timeline_steps FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin write access for projects" ON public.projects FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin write access for articles" ON public.articles FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin write access for gallery" ON public.gallery FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin write access for failures" ON public.failures FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin write access for journal_entries" ON public.journal_entries FOR ALL USING (auth.uid() IS NOT NULL);
