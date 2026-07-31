import { apiUrl } from "@/lib/api";

export type GalleryLayout = "carousel" | "grid";

export interface GalleryImage {
  src: string;
  caption?: string;
}

export interface GalleryData {
  layout: GalleryLayout;
  columns: number;
  images: GalleryImage[];
}

/** Приводит относительные ссылки из админки (`/media/...`) к абсолютным. */
export function resolveMediaUrl(src: string): string {
  return apiUrl(src);
}

/**
 * Читает данные галереи из DOM-узла, вставленного CKEditor.
 * Источник истины — `data-images`; если атрибут потерялся или испортился,
 * собираем картинки из вложенных <img>.
 */
export function readGalleryNode(node: HTMLElement): GalleryData | null {
  let images: GalleryImage[] = [];

  const raw = node.getAttribute("data-images");
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        images = parsed
          .filter((item): item is GalleryImage => !!item && typeof (item as GalleryImage).src === "string")
          .map((item) => ({ src: item.src, caption: item.caption || "" }));
      }
    } catch {
      // повреждённый JSON — ниже сработает запасной вариант
    }
  }

  if (!images.length) {
    images = Array.from(node.querySelectorAll("img")).map((img) => ({
      src: img.getAttribute("src") || "",
      caption: img.getAttribute("alt") || "",
    }));
  }

  images = images
    .map((image) => ({ src: resolveMediaUrl(image.src), caption: image.caption || "" }))
    .filter((image) => !!image.src);

  if (!images.length) return null;

  const layout: GalleryLayout = node.getAttribute("data-ardi-gallery") === "grid" ? "grid" : "carousel";
  const columns = Math.min(4, Math.max(2, parseInt(node.getAttribute("data-columns") || "3", 10) || 3));

  return { layout, columns, images };
}

export const GALLERY_SELECTOR = "[data-ardi-gallery], .ardi-gallery";
