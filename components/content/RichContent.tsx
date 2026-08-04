"use client";

import { useMemo, useRef, type MouseEvent } from "react";

import { useGalleryPortals } from "./useGalleryPortals";

interface RichContentProps {
  html: string;
  className?: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

/**
 * Рендерит HTML из CKEditor и подменяет вставленные из админки блоки
 * `.ardi-gallery` на интерактивные галереи / слайдеры.
 */
export default function RichContent({ html, className, onClick }: RichContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const portals = useGalleryPortals(ref, html);

  // React 19 сравнивает dangerouslySetInnerHTML по идентичности объекта, а не по
  // строке: литерал {__html: …} пересоздавался бы на каждом рендере и перезаписывал
  // innerHTML, стирая галереи, вставленные порталами. Держим ссылку стабильной.
  const markup = useMemo(() => ({ __html: html }), [html]);

  return (
    <>
      <div ref={ref} className={className} onClick={onClick} dangerouslySetInnerHTML={markup} />
      {portals}
    </>
  );
}
