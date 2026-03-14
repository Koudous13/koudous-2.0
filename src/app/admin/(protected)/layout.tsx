import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    // Redirection immédiate si non authentifié
    if (error || !user) {
        redirect("/admin/login");
    }

    return (
        <div className="flex flex-col md:flex-row h-screen bg-koudous-bg text-koudous-text font-sans overflow-hidden">
            <AdminSidebar userEmail={user.email || ""} />

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 overflow-y-auto relative h-full">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-koudous-secondary)_0%,_transparent_40%)] opacity-5 pointer-events-none"></div>
                <div className="p-4 md:p-8 relative z-10 w-full max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
