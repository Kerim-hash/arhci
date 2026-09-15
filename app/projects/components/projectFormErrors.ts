const FIELD_LABELS: Record<string, string> = {
  title: "Заголовок",
  description: "Описание",
  images: "Изображения",
  removeImageIds: "Удаляемые изображения",
  remove_image_ids: "Удаляемые изображения",
  previewImageId: "Обложка",
  preview_image_id: "Обложка",
};

/** Превращает ошибку DRF ({field: [messages]} или {detail}) в текст для формы. */
export function formatProjectApiError(err: unknown, fallback: string): string {
  const data = (err as { data?: unknown } | null)?.data;
  if (data && typeof data === "object") {
    const lines = Object.entries(data as Record<string, unknown>).map(([field, errors]) => {
      const text = Array.isArray(errors) ? errors.join(", ") : String(errors);
      if (field === "detail" || field === "nonFieldErrors") return text;
      return `${FIELD_LABELS[field] ?? field}: ${text}`;
    });
    if (lines.length > 0) return lines.join("\n");
  }
  const message = (err as { message?: string } | null)?.message;
  return message || fallback;
}
