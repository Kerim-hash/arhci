import { formatApiError } from "@/lib/formatApiError";

const FIELD_LABELS: Record<string, string> = {
  title: "Заголовок",
  description: "Описание",
  category: "Специальность",
  images: "Изображения",
  removeImageIds: "Удаляемые изображения",
  remove_image_ids: "Удаляемые изображения",
  previewImageId: "Обложка",
  preview_image_id: "Обложка",
};

/** Ошибка API проекта ({field: [messages]} или {detail}) в текст для формы. */
export function formatProjectApiError(err: unknown, fallback: string): string {
  return formatApiError(err, fallback, FIELD_LABELS);
}
