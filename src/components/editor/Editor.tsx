"use client";

import { useEditor, EditorContent, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Bold, Italic, List, ListOrdered, CheckSquare, Link as LinkIcon, Code, Heading1, Heading2, Quote } from 'lucide-react';

interface EditorProps {
    content: string;
    onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const buttons = [
        { icon: <Heading1 className="w-4 h-4" />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: editor.isActive('heading', { level: 1 }) },
        { icon: <Heading2 className="w-4 h-4" />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: editor.isActive('heading', { level: 2 }) },
        { icon: <Bold className="w-4 h-4" />, action: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold') },
        { icon: <Italic className="w-4 h-4" />, action: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic') },
        { icon: <Quote className="w-4 h-4" />, action: () => editor.chain().focus().toggleBlockquote().run(), isActive: editor.isActive('blockquote') },
        { icon: <List className="w-4 h-4" />, action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList') },
        { icon: <ListOrdered className="w-4 h-4" />, action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList') },
        { icon: <CheckSquare className="w-4 h-4" />, action: () => editor.chain().focus().toggleTaskList().run(), isActive: editor.isActive('taskList') },
        { icon: <Code className="w-4 h-4" />, action: () => editor.chain().focus().toggleCodeBlock().run(), isActive: editor.isActive('codeBlock') },
    ];

    return (
        <div className="flex items-center gap-1 border-b border-border p-2 sticky top-0 bg-background z-10 overflow-x-auto no-scrollbar whitespace-nowrap">
            {buttons.map((btn, i) => (
                <button
                    key={i}
                    onClick={btn.action}
                    className={`p-1.5 rounded-md hover:bg-muted transition-colors ${btn.isActive ? 'bg-muted text-accent' : 'text-muted-foreground'}`}
                >
                    {btn.icon}
                </button>
            ))}
        </div>
    );
};

export default function Editor({ content, onChange }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Write something brilliant…",
            }),
            Link.configure({
                openOnClick: false,
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none max-w-none min-h-[500px]',
            },
        },
    });

    return (
        <div className="w-full h-full flex flex-col">
            <MenuBar editor={editor} />
            {editor && (
                <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
                    <div className="flex items-center gap-1 bg-background border border-border shadow-xl rounded-lg p-1.5 backdrop-blur-md bg-background/90">
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className="p-1.5 hover:bg-muted rounded text-xs font-bold"
                        >H1</button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className="p-1.5 hover:bg-muted rounded text-xs font-bold"
                        >H2</button>
                        <button
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className="p-1.5 hover:bg-muted rounded"
                        ><List className="w-3.5 h-3.5" /></button>
                    </div>
                </FloatingMenu>
            )}
            <div className="flex-1 overflow-y-auto">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
