import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
    console.log("🚀 Lancement des tests E2E sur Supabase...");

    // 1. Test: Create a Project
    console.log("📝 Création d'un projet de test...");
    const { data: project, error: pError } = await supabase
        .from('projects')
        .insert([
            {
                title: 'Système Koudous Alpha',
                slug: 'systeme-koudous-alpha-' + Date.now(),
                short_description: 'Architecture IA en production.',
                description: '<h2>Description Complète</h2><p>Le système répond de bout en bout.</p>',
                is_pro: true,
                stack_tags: ['Next.js', 'Supabase', 'Python'],
                metrics: { "Requêtes": "100k/s", "Uptime": "99.9%" }
            }
        ])
        .select()
        .single();

    if (pError) {
        console.error("❌ Erreur Projet:", pError);
    } else {
        console.log("✅ Projet créé avec succès:", project.title);

        // 2. Test: Create an Article linked to the Project
        console.log("📝 Création d'un article lié...");
        const { data: article, error: aError } = await supabase
            .from('articles')
            .insert([
                {
                    title: 'Journal de conception : Jour 1',
                    slug: 'journal-jour-1-' + Date.now(),
                    excerpt: 'La première pierre de l\'édifice.',
                    content: '<p>Initialisation des bases de données et des middlewares.</p>',
                    project_id: project.id,
                    published: true
                }
            ])
            .select()
            .single();

        if (aError) console.error("❌ Erreur Article:", aError);
        else console.log("✅ Article créé avec succès:", article.title);
    }

    // 3. Test: Create a Journal Entry
    console.log("📝 Création d'une entrée journalière...");
    const { data: journal, error: jError } = await supabase
        .from('journal_entries')
        .insert([
            {
                content: '<p>Aujourd\'hui, tout a fonctionné du premier coup. L\'interface Admin est parfaite.</p>',
                mood_tags: ['#SUCCESS', '#STABLE']
            }
        ])
        .select()
        .single();

    if (jError) console.error("❌ Erreur Journal:", jError);
    else console.log("✅ Entrée journalière créée.");

    console.log("🎉 Série de tests d'insertion terminée.");
}

runTests();
