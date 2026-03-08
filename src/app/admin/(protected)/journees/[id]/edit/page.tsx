import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import EditJournalForm from "./EditJournalForm";

export default async function EditJournalPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: entry } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("id", id)
        .single();

    if (!entry) notFound();

    return <EditJournalForm entry={entry} />;
}

