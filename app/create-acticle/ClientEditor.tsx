"use client";

import dynamic from "next/dynamic";

const BlockNoteEditor = dynamic(
  () => import("@/components/BlockNoteEditor"),
  { ssr: false }
);

interface ClientEditorProps {
  onChange?: (html: string) => void;
  editable?: boolean;
}

export default function ClientEditor({ onChange, editable = true }: ClientEditorProps) {
  return <BlockNoteEditor onChange={onChange} editable={editable} />;
}
