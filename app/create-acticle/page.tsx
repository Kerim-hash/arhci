"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import Image from "next/image";
import { ru } from "@blocknote/core/locales";

export default function App() {
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "heading",
        props: { level: 1 },
        content: [],
      },
      {
        type: "paragraph",
        content: [],
      },
    ],
    dictionary: ru,

    editorProps: {
      placeholders: {
        heading: "Заголовок",
        paragraph: "О чем вы хотели бы написать?",
      },
    },
  });

  return (
    <section className="container mx-auto relative px-4 sm:px-6">
      <div className="flex items-center gap-2 mb-5 text-sm text-muted-foreground">
        Написать как:
        <Image
          src="/article.jpg"
          width={24}
          height={24}
          alt="article"
          className="rounded-full"
        />
        Daniar Asanov
      </div>

      <BlockNoteView editor={editor} theme="light" lang="ru" />
    </section>
  );
}
