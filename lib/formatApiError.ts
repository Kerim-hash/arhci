/**
 * Превращает ошибку DRF в текст для формы.
 *
 * Поддерживает все три формы ответа: {field: [messages]}, {detail: "..."}
 * и список сообщений без привязки к полю. Названия полей подставляются из
 * `labels`, незнакомые поля выводятся как есть.
 */
export function formatApiError(
  err: unknown,
  fallback: string,
  labels: Record<string, string> = {},
): string {
  const data = (err as { data?: unknown } | null)?.data;
  if (Array.isArray(data)) {
    const text = data.map(String).join(", ");
    if (text) return text;
  } else if (data && typeof data === "object") {
    const lines = Object.entries(data as Record<string, unknown>).map(([field, errors]) => {
      const text = Array.isArray(errors) ? errors.join(", ") : String(errors);
      if (field === "detail" || field === "nonFieldErrors") return text;
      return `${labels[field] ?? field}: ${text}`;
    });
    if (lines.length > 0) return lines.join("\n");
  }
  const message = (err as { message?: string } | null)?.message;
  return message || fallback;
}
