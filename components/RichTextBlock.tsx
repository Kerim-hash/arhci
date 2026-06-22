"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { ru } from "@blocknote/core/locales";

interface RichTextBlockProps {
  onChange: (html: string) => void;
}

export default function RichTextBlock({ onChange }: RichTextBlockProps) {
  const editor = useCreateBlockNote({
    initialContent: [
      { type: "paragraph", content: [] },
    ],
    dictionary: ru,
  });

  return (
    <div className="rich-text-block">
      <BlockNoteView
        editor={editor}
        theme="light"
        lang="ru"
        slashMenu={false}
        onChange={async () => {
          const html = await editor.blocksToHTMLLossy(editor.document);
          onChange(html);
        }}
      />
    </div>
  );
}
