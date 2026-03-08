import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin/',       // Protect admin dashboard
                '/_next/',       // Next.js internals
                '/api/',         // Internal API routes
            ],
        },
        sitemap: 'https://koudous-2-0.vercel.app/sitemap.xml',
    };
}
