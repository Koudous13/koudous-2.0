// SERVER COMPONENT — fetches data with authenticated server Supabase client
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import EditParcoursForm from "./EditParcoursForm";

export default async function EditParcoursPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: step, error } = await supabase
        .from("timeline_steps")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !step) {
        notFound();
    }

    return <EditParcoursForm step={step} />;
}
