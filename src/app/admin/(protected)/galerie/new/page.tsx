"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Upload, X, CheckCircle, Loader2, ArrowLeft, Image as ImgIcon } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["Projets", "Lifestyle", "Voyage", "Tech", "Events", "Personnel", "Autre"];

interface UploadedFile {
    file: File;
    preview: string;
    status: "pending" | "uploading" | "done" | "error";
    url?: string;
    title: string;
    category: string;
    error?: string;
}

export default function NewGaleriePage() {
    const router = useRouter();
    const supabase = createClient();
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addFiles = (newFiles: FileList | null) => {
        if (!newFiles) return;
        const entries: UploadedFile[] = Array.from(newFiles)
            .filter(f => f.type.startsWith("image/"))
            .map(file => ({
                file,
                preview: URL.createObjectURL(file),
                status: "pending",
                title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
                category: "Autre",
            }));
        setFiles(prev => [...prev, ...entries]);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(e.dataTransfer.files);
    }, []);

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const updateFile = (index: number, updates: Partial<UploadedFile>) => {
        setFiles(prev => prev.map((f, i) => i === index ? { ...f, ...updates } : f));
    };

    const handleSubmit = async () => {
        if (files.length === 0) return;
        setIsSubmitting(true);

        for (let i = 0; i < files.length; i++) {
            const item = files[i];
            if (item.status === "done") continue;

            updateFile(i, { status: "uploading" });

            try {
                const ext = item.file.name.split(".").pop();
                const path = `gallery/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
                const { data, error: uploadError } = await supabase.storage
                    .from("images")
                    .upload(path, item.file, { cacheControl: "3600", upsert: false });
                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(data.path);

                const { error: dbError } = await supabase.from("gallery").insert([{
                    image_url: publicUrl,
                    title: item.title || null,
                    category: item.category,
                }]);
                if (dbError) throw dbError;

                updateFile(i, { status: "done", url: publicUrl });
            } catch (err: any) {
                updateFile(i, { status: "error", error: err.message });
            }
        }

        setIsSubmitting(false);
        const allDone = files.every(f => f.status === "done");
        if (allDone) {
            router.push("/admin/galerie");
            router.refresh();
        }
    };

    const pendingCount = files.filter(f => f.status !== "done").length;

    return (
        <div className="max-w-5xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/galerie" className="p-2 text-koudous-text/50 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Ajouter des Photos</h1>
                    <p className="text-koudous-text/60 mt-1">Drag & Drop ou sélection multiple depuis votre PC</p>
                </div>
            </div>

            {/* Drop Zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer mb-8 ${isDragging ? "border-koudous-primary bg-koudous-primary/10 scale-[1.01]" : "border-white/20 hover:border-white/40 bg-white/5"}`}
                onClick={() => document.getElementById("gallery-file-input")?.click()}
            >
                <input
                    id="gallery-file-input"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => addFiles(e.target.files)}
                />
                <ImgIcon size={48} className={`mx-auto mb-4 ${isDragging ? "text-koudous-primary" : "text-koudous-text/30"}`} />
                <p className={`text-lg font-bold mb-2 ${isDragging ? "text-koudous-primary" : "text-white"}`}>
                    {isDragging ? "Lâchez les fichiers ici !" : "Glissez vos images ici"}
                </p>
                <p className="text-koudous-text/50 text-sm">ou cliquez pour sélectionner • JPG, PNG, WebP, GIF</p>
                {files.length > 0 && (
                    <span className="absolute top-4 right-4 bg-koudous-primary text-black text-xs font-bold px-2 py-1 rounded-full">
                        {files.length} fichier{files.length > 1 ? "s" : ""}
                    </span>
                )}
            </div>

            {/* File List */}
            {files.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {files.map((item, index) => (
                            <div key={index} className={`bg-white/5 border rounded-xl overflow-hidden transition-all ${item.status === "done" ? "border-green-500/50" : item.status === "error" ? "border-red-500/50" : "border-white/10"}`}>
                                {/* Preview */}
                                <div className="relative aspect-video bg-black/40 overflow-hidden">
                                    <img src={item.preview} alt="" className="w-full h-full object-cover" />
                                    {/* Status overlay */}
                                    {item.status === "uploading" && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <Loader2 size={28} className="animate-spin text-koudous-primary" />
                                        </div>
                                    )}
                                    {item.status === "done" && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <CheckCircle size={32} className="text-green-400" />
                                        </div>
                                    )}
                                    {item.status !== "uploading" && (
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-red-600 rounded-full transition-colors"
                                        >
                                            <X size={14} className="text-white" />
                                        </button>
                                    )}
                                </div>
                                {/* Metadata */}
                                <div className="p-3 space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Titre (optionnel)"
                                        value={item.title}
                                        onChange={(e) => updateFile(index, { title: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-koudous-primary"
                                        disabled={item.status === "uploading" || item.status === "done"}
                                    />
                                    <select
                                        value={item.category}
                                        onChange={(e) => updateFile(index, { category: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-koudous-primary"
                                        disabled={item.status === "uploading" || item.status === "done"}
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    {item.status === "error" && (
                                        <p className="text-red-400 text-xs">{item.error}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => setFiles([])}
                            className="text-koudous-text/50 hover:text-white text-sm transition-colors"
                        >
                            Tout effacer
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting || pendingCount === 0}
                            className="flex items-center gap-2 px-8 py-3 bg-koudous-primary text-black font-bold rounded-lg hover:shadow-[0_0_20px_var(--color-koudous-primary)] transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <><Loader2 size={18} className="animate-spin" /> Upload en cours...</>
                            ) : (
                                <><Upload size={18} /> Uploader {pendingCount} photo{pendingCount > 1 ? "s" : ""}</>
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
