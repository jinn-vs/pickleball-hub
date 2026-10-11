"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  onImageUpload?: (file: File) => Promise<string | null>;
};

export default function TiptapEditor({ value, onChange, onImageUpload }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      ImageExt.configure({ HTMLAttributes: { loading: "lazy" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Write the article…" }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "article-body min-h-[360px] focus:outline-none px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // keep editor in sync when loading an existing article
  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  if (!editor) return null;

  const Btn = ({ onClick, active, label }: { onClick: () => void; active?: boolean; label: string }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        backgroundColor: active ? "var(--color-green)" : "#1f2937",
        color: active ? "#fff" : "#9ca3af",
      }}
      className="px-2.5 py-1 rounded text-xs font-semibold"
    >
      {label}
    </button>
  );

  async function addImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !onImageUpload) return;
      const url = await onImageUpload(file);
      if (url) editor!.chain().focus().setImage({ src: url }).run();
    };
    input.click();
  }

  function addLink() {
    const url = window.prompt("URL");
    if (url) editor!.chain().focus().setLink({ href: url }).run();
    else editor!.chain().focus().unsetLink().run();
  }

  return (
    <div style={{ border: "1px solid #374151" }} className="rounded-lg overflow-hidden">
      <div style={{ backgroundColor: "#111827", borderBottom: "1px solid #374151" }} className="flex flex-wrap gap-1 p-2">
        <Btn label="B" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
        <Btn label="I" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <Btn label="U" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} />
        <Btn label="H2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
        <Btn label="H3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
        <Btn label="• List" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <Btn label="1. List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        <Btn label="❝" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <Btn label="Link" active={editor.isActive("link")} onClick={addLink} />
        {onImageUpload && <Btn label="Image" onClick={addImage} />}
      </div>
      <div style={{ backgroundColor: "#fff" }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
