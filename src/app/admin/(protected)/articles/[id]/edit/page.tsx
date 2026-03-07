// SERVER COMPONENT — fetches data with the server Supabase client (full auth)
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import EditArticleForm from "./EditArticleForm";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const [{ data: article, error }, { data: projects }] = await Promise.all([
        supabase.from("articles").select("*").eq("id", id).single(),
        supabase.from("projects").select("id, title").order("title"),
    ]);

    if (error || !article) {
        notFound();
    }

    return <EditArticleForm article={article} projects={projects || []} />;
}
