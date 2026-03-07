// SERVER COMPONENT — fetches data with the server Supabase client (full auth)
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import EditEchecForm from "./EditEchecForm";

export default async function EditEchecPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: failure, error } = await supabase
        .from("failures")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !failure) {
        notFound();
    }

    return <EditEchecForm failure={failure} />;
}
