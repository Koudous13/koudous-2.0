"use client";

import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface ImageUploaderProps {
    onUpload: (url: string) => void;
    bucket?: string;
    folder?: string;
    currentUrl?: string;
    className?: string;
}

export default function ImageUploader({
    onUpload,
    bucket = "images",
    folder = "uploads",
    currentUrl,
    className,
}: ImageUploaderProps) {
    const supabase = createClient();
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentUrl || null);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Veuillez sélectionner une image valide.");
            return;
        }

        // Validate size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("L'image ne doit pas dépasser 5MB.");
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

            const { data, error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(data.path);

            setPreview(publicUrl);
            onUpload(publicUrl);
        } catch (err: any) {
            setError("Erreur d'upload: " + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onUpload("");
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className={className}>
            {preview ? (
                <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/40">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="flex items-center gap-2 bg-koudous-primary text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-white transition-colors"
                        >
                            <Upload size={16} /> Changer
                        </button>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="flex items-center gap-2 bg-red-500/80 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-500 transition-colors"
                        >
                            <X size={16} /> Supprimer
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => inputRef.current?.click()}
                    className="w-full h-40 border-2 border-dashed border-white/20 hover:border-koudous-primary/50 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors bg-black/20 hover:bg-koudous-primary/5"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="text-koudous-primary animate-spin" size={32} />
                            <span className="text-sm text-koudous-text/60">Upload en cours...</span>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                                <ImageIcon className="text-koudous-text/40" size={24} />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-white">Cliquer pour uploader</p>
                                <p className="text-xs text-koudous-text/50 mt-1">PNG, JPG, WEBP jusqu'à 5MB</p>
                            </div>
                        </>
                    )}
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {error && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                    <X size={14} /> {error}
                </p>
            )}
        </div>
    );
}
