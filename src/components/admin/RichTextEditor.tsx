"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Undo, Redo, ImageIcon, Link as LinkIcon, Loader2, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

import { Terminal, Code2 } from 'lucide-react';

const MenuBar = ({ editor, showCode, setShowCode }: { editor: any, showCode: boolean, setShowCode: (v: boolean) => void }) => {
    const [isUploading, setIsUploading] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    if (!editor) return null;

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // ... (rest of image upload remains same)
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `editor/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const { data, error } = await supabase.storage
                .from('images')
                .upload(fileName, file, { cacheControl: '3600', upsert: false });
            if (error) throw error;
            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
            editor.chain().focus().setImage({ src: publicUrl }).run();
        } catch (err: any) {
            alert('Erreur upload image: ' + err.message);
        } finally {
            setIsUploading(false);
            if (imageInputRef.current) imageInputRef.current.value = '';
        }
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL du lien:', previousUrl);
        if (url === null) return;
        if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 bg-black/60 border-b border-white/10 rounded-t-lg sticky top-0 z-10 backdrop-blur-sm">
            <div className="flex gap-1 items-center bg-white/5 p-1 rounded-md mr-2 border border-white/5">
                <button 
                    type="button" 
                    onClick={() => setShowCode(false)} 
                    className={`p-1.5 rounded transition-all ${!showCode ? 'bg-koudous-primary text-black' : 'text-koudous-text/60 hover:text-white'}`} 
                    title="Visuel"
                >
                    <PenTool size={14} />
                </button>
                <button 
                    type="button" 
                    onClick={() => setShowCode(true)} 
                    className={`p-1.5 rounded transition-all ${showCode ? 'bg-koudous-secondary text-black' : 'text-koudous-text/60 hover:text-white'}`} 
                    title="Code Source (Pro)"
                >
                    <Terminal size={14} />
                </button>
            </div>

            {!showCode && (
                <>
                    <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bold') ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`} title="Gras"><Bold size={15} /></button>
                    <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('italic') ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`} title="Italique"><Italic size={15} /></button>
                    <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('strike') ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`} title="Barré"><Strikethrough size={15} /></button>
                    <div className="w-px h-6 bg-white/10 mx-1 self-center" />
                    <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 1 }) ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`} title="Titre 1"><Heading1 size={15} /></button>
                    <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 2 }) ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`} title="Titre 2"><Heading2 size={15} /></button>
                    <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 3 }) ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`} title="Titre 3"><Heading3 size={15} /></button>
                    <div className="w-px h-6 bg-white/10 mx-1 self-center" />
                    <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive({ textAlign: 'left' }) ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`} title="Aligner à gauche"><AlignLeft size={15} /></button>
                    <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive({ textAlign: 'center' }) ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`} title="Centrer"><AlignCenter size={15} /></button>
                    <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive({ textAlign: 'right' }) ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`} title="Aligner à droite"><AlignRight size={15} /></button>
                    <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`} title="Justifier"><AlignJustify size={15} /></button>
                    <div className="w-px h-6 bg-white/10 mx-1 self-center" />
                    <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bulletList') ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`} title="Liste"><List size={15} /></button>
                    <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('orderedList') ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`} title="Liste numérotée"><ListOrdered size={15} /></button>
                    <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('blockquote') ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`} title="Citation"><Quote size={15} /></button>
                    <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('codeBlock') ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`} title="Bloc de code"><Code size={15} /></button>
                    <div className="w-px h-6 bg-white/10 mx-1 self-center" />
                    <button type="button" onClick={setLink} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('link') ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`} title="Lien"><LinkIcon size={15} /></button>
                    <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isUploading}
                        className="p-2 rounded hover:bg-white/10 text-koudous-primary disabled:opacity-50"
                        title="Insérer une image depuis votre PC"
                    >
                        {isUploading ? <Loader2 size={15} className="animate-spin" /> : <ImageIcon size={15} />}
                    </button>
                    <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </>
            )}

            {showCode && (
                <div className="flex items-center px-4 text-koudous-secondary font-mono text-[10px] tracking-widest uppercase animate-pulse">
                    <Code2 size={14} className="mr-2" /> Mode Code Source Activé
                </div>
            )}

            <div className="flex-grow" />
            <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} className="p-2 rounded hover:bg-white/10 text-koudous-text/50 disabled:opacity-30" title="Annuler"><Undo size={15} /></button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} className="p-2 rounded hover:bg-white/10 text-koudous-text/50 disabled:opacity-30" title="Refaire"><Redo size={15} /></button>
        </div>
    );
};

export default function RichTextEditor({ content, onChange, placeholder = "Rédiger ici..." }: RichTextEditorProps) {
    const [mounted, setMounted] = useState(false);
    const [showCode, setShowCode] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    HTMLAttributes: {
                        class: '',
                    },
                },
                paragraph: {
                    HTMLAttributes: {
                        class: '',
                    },
                },
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'], defaultAlignment: 'left' }),
            Image.configure({ inline: false, allowBase64: true }),
            Link.configure({ openOnClick: false }),
        ],
        // Extending nodes to ensure class preservation
        onCreate({ editor }) {
            // This is a more aggressive way to ensure classes are kept
            // but for now let's rely on the HTMLAttributes above and see.
        },
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4 text-koudous-text/90',
            },
            // Force Tiptap to keep the classes from the HTML
            transformPastedHTML(html) {
                return html;
            },
        },
        onUpdate: ({ editor }) => { onChange(editor.getHTML()); },
    });

    if (!mounted) {
        return (
            <div className="border border-white/10 rounded-lg bg-white/5 overflow-hidden min-h-[300px] flex items-center justify-center">
                <Loader2 className="animate-spin text-koudous-primary/50" />
            </div>
        );
    }

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        onChange(val);
        editor?.commands.setContent(val, false);
    };

    return (
        <div className="border border-white/10 rounded-lg bg-white/5 overflow-hidden">
            <MenuBar editor={editor} showCode={showCode} setShowCode={setShowCode} />
            
            {showCode ? (
                <div className="p-0 bg-black/40 min-h-[300px]">
                    <textarea
                        value={content}
                        onChange={handleCodeChange}
                        className="w-full h-[500px] p-6 bg-black/80 text-green-400 font-mono text-sm focus:outline-none resize-none selection:bg-koudous-primary/30"
                        spellCheck={false}
                    />
                </div>
            ) : (
                <EditorContent editor={editor} />
            )}
        </div>
    );
}
