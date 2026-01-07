"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { ru } from "@blocknote/core/locales";

export default function BlockNoteEditor() {
  const editor = useCreateBlockNote({
    initialContent: [
      { type: "heading", props: { level: 1 }, content: [] },
      { type: "paragraph", content: [] },
    ],
    dictionary: ru,
    editorProps: {
      placeholders: {
        heading: "Заголовок",
        paragraph: "О чем вы хотели бы написать?",
      },
    },
  });

  return <BlockNoteView editor={editor} theme="light" lang="ru" />;
}
