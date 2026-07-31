"use client";

import { useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

import ArdiGallery from "./ArdiGallery";
import { GALLERY_SELECTOR, readGalleryNode, type GalleryData } from "./gallery";

interface Mount {
  node: HTMLElement;
  data: GalleryData;
}

/**
 * Находит блоки галерей внутри HTML, вставленного через dangerouslySetInnerHTML,
 * и подменяет их настоящими React-компонентами через порталы.
 *
 * Возвращает список порталов — их нужно отрендерить рядом с контейнером.
 */
export function useGalleryPortals(containerRef: RefObject<HTMLElement | null>, html: string) {
  const [mounts, setMounts] = useState<Mount[]>([]);

  useEffect(() => {
    const next: Mount[] = [];
    const root = containerRef.current;

    root?.querySelectorAll<HTMLElement>(GALLERY_SELECTOR).forEach((node) => {
      const data = readGalleryNode(node);
      if (!data) return;
      // Вложенные <img> нужны только как fallback без JS — убираем их,
      // чтобы не дублировать картинки под React-галереей.
      node.innerHTML = "";
      node.removeAttribute("style");
      node.classList.add("ardi-gallery--mounted");
      next.push({ node, data });
    });

    // Узлы для порталов существуют только после того, как React вставил HTML
    // в DOM, — прочитать их раньше эффекта невозможно.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounts((prev) => (prev.length === 0 && next.length === 0 ? prev : next));
  }, [containerRef, html]);

  return mounts.map((mount, index) =>
    createPortal(<ArdiGallery {...mount.data} />, mount.node, `ardi-gallery-${index}`),
  );
}
