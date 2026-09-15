"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { useEffect } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { ru } from "@blocknote/core/locales";

interface BlockNoteEditorProps {
  onChange?: (html: string) => void;
  editable?: boolean;
  /** Сохранённый HTML (например, описание проекта), который нужно редактировать. */
  initialHTML?: string;
}

export default function BlockNoteEditor({
  onChange,
  editable = true,
  initialHTML,
}: BlockNoteEditorProps) {
  const editor = useCreateBlockNote({
    initialContent: [
      { type: "heading", props: { level: 1 }, content: [] },
      { type: "paragraph", content: [] },
    ],
    dictionary: ru,
  });

  // Разобрать HTML в блоки умеет только готовый экземпляр редактора, поэтому
  // initialContent для этого не подходит. Заполняем один раз при монтировании.
  useEffect(() => {
    if (!initialHTML) return;
    const blocks = editor.tryParseHTMLToBlocks(initialHTML);
    if (blocks.length > 0) {
      editor.replaceBlocks(editor.document, blocks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return (
    <BlockNoteView
      editor={editor}
      theme="light"
      lang="ru"
      editable={editable}
      onChange={async () => {
        if (onChange) {
          const html = await editor.blocksToHTMLLossy(editor.document);
          onChange(html);
        }
      }}
    />
  );
}
