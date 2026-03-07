"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteButtonProps {
    table: string;
    id: string;
    redirectTo?: string;
    label?: string;
    className?: string;
}

export default function DeleteButton({
    table,
    id,
    redirectTo,
    label = "Supprimer",
    className,
}: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.`
        );
        if (!confirmed) return;

        setIsDeleting(true);
        try {
            const { error } = await supabase.from(table).delete().eq("id", id);
            if (error) throw error;

            if (redirectTo) {
                router.push(redirectTo);
            }
            router.refresh();
        } catch (err: any) {
            alert("Erreur lors de la suppression : " + err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className={
                className ||
                "p-2 text-koudous-text/60 hover:text-red-400 transition-colors disabled:opacity-50"
            }
            title={label}
        >
            {isDeleting ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                <Trash2 size={18} />
            )}
        </button>
    );
}
