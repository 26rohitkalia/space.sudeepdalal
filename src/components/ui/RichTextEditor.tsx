'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Bold, Italic, List, ListOrdered, Strikethrough } from 'lucide-react'

interface EditorProps {
  content: string
  onChange: (html: string) => void
}

const MenuButton = ({ 
  onClick, 
  isActive, 
  children 
}: { 
  onClick: () => void
  isActive: boolean
  children: React.ReactNode 
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 rounded-lg transition-all cursor-pointer ${
      isActive 
        ? 'bg-accent text-accent-foreground shadow-md' 
        : 'text-foreground/40 hover:bg-background hover:text-foreground'
    }`}
  >
    {children}
  </button>
)

export default function RichTextEditor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue-500 underline' },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none min-h-[150px] px-4 py-3 text-foreground prose-p:text-foreground prose-strong:text-foreground',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  return (
    <div className="border border-card-border rounded-xl overflow-hidden bg-background focus-within:ring-2 focus-within:ring-accent/20 transition-all text-foreground">
      <div className="flex items-center gap-1 p-2 border-b border-card-border bg-card-bg">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
        >
          <Bold className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
        >
          <Italic className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
        >
          <Strikethrough className="w-4 h-4" />
        </MenuButton>
        <div className="w-px h-4 bg-card-border mx-1" />
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        >
          <List className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
        >
          <ListOrdered className="w-4 h-4" />
        </MenuButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}