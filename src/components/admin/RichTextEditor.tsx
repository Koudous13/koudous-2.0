"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Undo, Redo, ImageIcon, Link as LinkIcon } from 'lucide-react';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('URL de l\'image (Temporaire, implémenter upload Supabase ensuite):');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL du lien:', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="flex flex-wrap gap-2 p-2 bg-black/40 border-b border-koudous-secondary/20 rounded-t-lg">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bold') ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`}
                title="Bold"
            >
                <Bold size={16} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('italic') ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`}
            >
                <Italic size={16} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('strike') ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`}
            >
                <Strikethrough size={16} />
            </button>

            <div className="w-px h-6 bg-koudous-secondary/20 mx-1 self-center"></div>

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 1 }) ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`}
            >
                <Heading1 size={16} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 2 }) ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`}
            >
                <Heading2 size={16} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 3 }) ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`}
            >
                <Heading3 size={16} />
            </button>

            <div className="w-px h-6 bg-koudous-secondary/20 mx-1 self-center"></div>

            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bulletList') ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`}
            >
                <List size={16} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('orderedList') ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`}
            >
                <ListOrdered size={16} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('blockquote') ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`}
            >
                <Quote size={16} />
            </button>

            <div className="w-px h-6 bg-koudous-secondary/20 mx-1 self-center"></div>

            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('codeBlock') ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`}
            >
                <Code size={16} />
            </button>

            <div className="w-px h-6 bg-koudous-secondary/20 mx-1 self-center"></div>

            <button onClick={setLink} className={`p-2 rounded hover:bg-white/10 ${editor.isActive('link') ? 'bg-koudous-primary/20 text-koudous-primary' : 'text-koudous-text'}`}>
                <LinkIcon size={16} />
            </button>
            <button onClick={addImage} className="p-2 rounded hover:bg-white/10 text-koudous-text">
                <ImageIcon size={16} />
            </button>

            <div className="flex-grow"></div>

            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-2 rounded hover:bg-white/10 text-koudous-text opacity-50 hover:opacity-100"
            >
                <Undo size={16} />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-2 rounded hover:bg-white/10 text-koudous-text opacity-50 hover:opacity-100"
            >
                <Redo size={16} />
            </button>
        </div>
    );
};

export default function RichTextEditor({ content, onChange, placeholder = "Rédiger ici..." }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4 text-koudous-text/90',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className="border border-white/10 rounded-lg bg-white/5 overflow-hidden">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
