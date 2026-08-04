"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link2, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, Undo2, Redo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-amber-brand underline" },
      }),
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder: placeholder || "Start writing..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[300px] rounded-b-lg border border-t-0 border-border bg-background p-4 focus:outline-none",
      },
    },
  });

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL (or paste from Media Library):");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const ToolButton = ({
    onClick,
    isActive,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded transition-colors",
        isActive ? "bg-amber-brand text-amber-foreground" : "hover:bg-accent text-muted-foreground"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-lg border border-border">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-secondary/50 p-2">
        {/* Undo/Redo */}
        <ToolButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo2 className="h-4 w-4" />
        </ToolButton>

        <div className="mx-1 h-5 w-px bg-border" />

        {/* Headings */}
        <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive("heading", { level: 1 })} title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive("heading", { level: 3 })} title="Heading 3">
          <Heading3 className="h-4 w-4" />
        </ToolButton>

        <div className="mx-1 h-5 w-px bg-border" />

        {/* Inline formatting */}
        <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="Bold">
          <Bold className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="Italic">
          <Italic className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} title="Strikethrough">
          <Strikethrough className="h-4 w-4" />
        </ToolButton>

        <div className="mx-1 h-5 w-px bg-border" />

        {/* Lists */}
        <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} title="Bullet List">
          <List className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} title="Numbered List">
          <ListOrdered className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} title="Quote">
          <Quote className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive("codeBlock")} title="Code Block">
          <Code className="h-4 w-4" />
        </ToolButton>

        <div className="mx-1 h-5 w-px bg-border" />

        {/* Alignment */}
        <ToolButton onClick={() => editor.chain().focus().setTextAlign("left").run()} isActive={editor.isActive({ textAlign: "left" })} title="Align Left">
          <AlignLeft className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().setTextAlign("center").run()} isActive={editor.isActive({ textAlign: "center" })} title="Align Center">
          <AlignCenter className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().setTextAlign("right").run()} isActive={editor.isActive({ textAlign: "right" })} title="Align Right">
          <AlignRight className="h-4 w-4" />
        </ToolButton>

        <div className="mx-1 h-5 w-px bg-border" />

        {/* Link & Image */}
        <ToolButton onClick={setLink} isActive={editor.isActive("link")} title="Add Link">
          <Link2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={addImage} title="Add Image">
          <ImageIcon className="h-4 w-4" />
        </ToolButton>

        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span>{editor.storage.characterCount?.words?.() || 0} words</span>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Tiptap styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .ProseMirror { outline: none; }
        .ProseMirror h1 { font-size: 1.875rem; font-weight: 700; margin: 1rem 0 0.5rem; }
        .ProseMirror h2 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; }
        .ProseMirror h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
        .ProseMirror p { margin: 0.5rem 0; line-height: 1.6; color: hsl(var(--foreground)); }
        .ProseMirror ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .ProseMirror ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .ProseMirror li { margin: 0.25rem 0; }
        .ProseMirror blockquote { border-left: 3px solid var(--amber); padding-left: 1rem; margin: 0.75rem 0; font-style: italic; color: hsl(var(--muted-foreground)); }
        .ProseMirror pre { background: hsl(var(--secondary)); border-radius: 0.5rem; padding: 0.75rem; overflow-x: auto; font-size: 0.875rem; }
        .ProseMirror code { background: hsl(var(--secondary)); padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875rem; }
        .ProseMirror img { max-width: 100%; border-radius: 0.5rem; margin: 0.75rem 0; }
        .ProseMirror a { color: var(--amber); text-decoration: underline; }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
          float: left;
          height: 0;
        }
      ` }} />
    </div>
  );
}
