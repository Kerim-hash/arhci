"use client";

import dynamic from "next/dynamic";

const BlockNoteEditor = dynamic(
  () => import("@/components/BlockNoteEditor"),
  { ssr: false }
);

export default function ClientEditor() {
  return <BlockNoteEditor />;
}
