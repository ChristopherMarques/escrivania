"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Highlight from "@tiptap/extension-highlight"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import CharacterCount from "@tiptap/extension-character-count"
import Placeholder from "@tiptap/extension-placeholder"
import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { Decoration, DecorationSet } from "@tiptap/pm/view"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Bold,
  Italic,
  Strikethrough,
  Highlighter,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Type,
  Hash,
} from "lucide-react"
import { useState, useCallback, useEffect } from "react"
import type { ICharacter, ILocation } from "@/lib/types"

interface TiptapEditorProps {
  content: any
  onChange: (content: any) => void
  characters?: ICharacter[]
  locations?: ILocation[]
  placeholder?: string
  className?: string
}

// Custom Mention extension for @characters and #locations
const MentionExtension = Extension.create({
  name: "mention",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("mention"),
        props: {
          decorations: (state) => {
            const decorations: Decoration[] = []
            const doc = state.doc

            doc.descendants((node, pos) => {
              if (node.isText) {
                const text = node.text || ""

                // Match @mentions for characters
                const characterMatches = text.matchAll(/@(\w+)/g)
                for (const match of characterMatches) {
                  const start = pos + (match.index || 0)
                  const end = start + match[0].length
                  decorations.push(
                    Decoration.inline(start, end, {
                      class: "mention-character bg-purple-100 text-purple-700 px-1 rounded cursor-pointer",
                      "data-mention-type": "character",
                      "data-mention-name": match[1],
                    }),
                  )
                }

                // Match #mentions for locations
                const locationMatches = text.matchAll(/#(\w+)/g)
                for (const match of locationMatches) {
                  const start = pos + (match.index || 0)
                  const end = start + match[0].length
                  decorations.push(
                    Decoration.inline(start, end, {
                      class: "mention-location bg-blue-100 text-blue-700 px-1 rounded cursor-pointer",
                      "data-mention-type": "location",
                      "data-mention-name": match[1],
                    }),
                  )
                }
              }
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})

export function TiptapEditor({
  content,
  onChange,
  characters = [],
  locations = [],
  placeholder = "Comece a escrever sua história aqui...",
  className = "",
}: TiptapEditorProps) {
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: "highlight",
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CharacterCount,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      MentionExtension,
    ],
    content,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      onChange(json)

      // Update counts
      const stats = editor.storage.characterCount
      setWordCount(stats.words())
      setCharacterCount(stats.characters())
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] ${className}`,
      },
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getJSON()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const toggleHighlight = useCallback(
    (color: string) => {
      if (!editor) return

      if (editor.isActive("highlight", { color })) {
        editor.chain().focus().unsetHighlight().run()
      } else {
        editor.chain().focus().setHighlight({ color }).run()
      }
    },
    [editor],
  )

  if (!editor) {
    return null
  }

  return (
    <div className="w-full">
      {/* Fixed Toolbar */}
      <div className="border-b border-gray-200 bg-white/50 backdrop-blur-sm p-3 mb-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="h-8 w-8 p-0"
            >
              <Undo className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="h-8 w-8 p-0"
            >
              <Redo className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-2" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`h-8 w-8 p-0 ${editor.isActive("bold") ? "bg-purple-100 text-purple-700" : ""}`}
            >
              <Bold className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`h-8 w-8 p-0 ${editor.isActive("italic") ? "bg-purple-100 text-purple-700" : ""}`}
            >
              <Italic className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`h-8 w-8 p-0 ${editor.isActive("strike") ? "bg-purple-100 text-purple-700" : ""}`}
            >
              <Strikethrough className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-2" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleHighlight("yellow")}
              className={`h-8 w-8 p-0 ${editor.isActive("highlight", { color: "yellow" }) ? "bg-yellow-100 text-yellow-700" : ""}`}
            >
              <Highlighter className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleHighlight("pink")}
              className={`h-8 w-8 p-0 ${editor.isActive("highlight", { color: "pink" }) ? "bg-pink-100 text-pink-700" : ""}`}
            >
              <Highlighter className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-2" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`h-8 w-8 p-0 ${editor.isActive("bulletList") ? "bg-purple-100 text-purple-700" : ""}`}
            >
              <List className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`h-8 w-8 p-0 ${editor.isActive("orderedList") ? "bg-purple-100 text-purple-700" : ""}`}
            >
              <ListOrdered className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={`h-8 w-8 p-0 ${editor.isActive("taskList") ? "bg-purple-100 text-purple-700" : ""}`}
            >
              <Hash className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`h-8 w-8 p-0 ${editor.isActive("blockquote") ? "bg-purple-100 text-purple-700" : ""}`}
            >
              <Quote className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Type className="w-4 h-4" />
              <span>{wordCount} palavras</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {characterCount} caracteres
            </Badge>
          </div>
        </div>

        {/* Mention Helper */}
        <div className="mt-2 text-xs text-gray-500 flex items-center space-x-4">
          <span>💡 Digite @ para mencionar personagens</span>
          <span>💡 Digite # para mencionar locais</span>
        </div>
      </div>

      {/* Editor Content */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-b-lg focus-within:border-purple-300 transition-colors">
        <EditorContent editor={editor} className="p-6 min-h-[500px] prose prose-gray max-w-none focus:outline-none" />
      </div>

      {/* Character and Location Lists for Reference */}
      {(characters.length > 0 || locations.length > 0) && (
        <div className="mt-4 p-4 bg-gray-50/50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {characters.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Personagens disponíveis:</h4>
                <div className="flex flex-wrap gap-1">
                  {characters.map((char) => (
                    <Badge key={char.id} variant="outline" className="text-xs cursor-pointer hover:bg-purple-50">
                      @{char.name.replace(/\s+/g, "")}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {locations.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Locais disponíveis:</h4>
                <div className="flex flex-wrap gap-1">
                  {locations.map((loc) => (
                    <Badge key={loc.id} variant="outline" className="text-xs cursor-pointer hover:bg-blue-50">
                      #{loc.name.replace(/\s+/g, "")}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
