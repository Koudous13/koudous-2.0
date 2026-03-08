import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();
    const baseUrl = 'https://koudous-2-0.vercel.app';

    // 1. Pages statiques
    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${baseUrl}/parcours`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/realisations-pro`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/realisations-academiques`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/galerie`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
        { url: `${baseUrl}/journees`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
        { url: `${baseUrl}/echecs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ];

    // 2. Fetch all dynamic content in parallel
    const [
        { data: projects },
        { data: articles },
    ] = await Promise.all([
        supabase.from('projects').select('slug, updated_at, created_at'),
        supabase.from('articles').select('slug, updated_at, created_at').eq('published', true).neq('slug', '').not('slug', 'is', null),
    ]);

    // 3. Map dynamic Projects URLs
    const projectUrls: MetadataRoute.Sitemap = (projects || [])
        .filter(p => p.slug)
        .map((project) => ({
            url: `${baseUrl}/projets/${project.slug}`,
            lastModified: new Date(project.updated_at || project.created_at || new Date()),
            changeFrequency: 'monthly',
            priority: 0.8,
        }));

    // 4. Map dynamic Articles URLs
    const articleUrls: MetadataRoute.Sitemap = (articles || [])
        .filter(a => a.slug)
        .map((article) => ({
            url: `${baseUrl}/articles/${article.slug}`,
            lastModified: new Date(article.updated_at || article.created_at || new Date()),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

    return [...staticPages, ...projectUrls, ...articleUrls];
}
