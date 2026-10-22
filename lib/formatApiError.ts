/**
 * Превращает ошибку запроса к API в текст для пользователя.
 *
 * Для ответов DRF поддерживает все три формы: {field: [messages]},
 * {detail: "..."} и список сообщений без привязки к полю. Названия полей
 * подставляются из `labels`, незнакомые поля выводятся как есть.
 *
 * Если ответ пришёл не от DRF — страница 500 от Django или nginx, обрыв
 * сети, таймаут, — RTK Query кладёт в `data` сырой HTML или ничего.
 * Показывать пользователю «<!doctype html>…» нельзя, поэтому такие случаи
 * сводятся к понятной фразе.
 */

export const SERVER_UNAVAILABLE_MESSAGE =
  "Сервер временно недоступен. Попробуйте ещё раз через минуту.";
export const NETWORK_ERROR_MESSAGE =
  "Нет соединения с сервером. Проверьте интернет и попробуйте снова.";
export const PAYLOAD_TOO_LARGE_MESSAGE =
  "Файлы слишком большие для одной отправки. Уменьшите их размер или загрузите частями.";

const HTTP_SERVER_ERROR = 500;
const HTTP_PAYLOAD_TOO_LARGE = 413;
const HTML_MARKUP = /<\/?html/i;
const NETWORK_STATUSES: ReadonlyArray<unknown> = ["FETCH_ERROR", "TIMEOUT_ERROR"];
const UNLABELED_FIELDS: ReadonlyArray<string> = ["detail", "nonFieldErrors", "message"];

type QueryError = {
  status?: unknown;
  originalStatus?: unknown;
  data?: unknown;
  message?: unknown;
};

/** Сообщение для ответа не от DRF (сбой сети, страница Django/nginx) или null, если ответ обычный. */
function infrastructureMessage(err: QueryError, fallback: string): string | null {
  if (NETWORK_STATUSES.includes(err.status)) {
    return NETWORK_ERROR_MESSAGE;
  }
  // При не-JSON ответе RTK Query ставит status: "PARSING_ERROR", а HTTP-код — в originalStatus
  const httpStatus = typeof err.originalStatus === "number" ? err.originalStatus : err.status;
  if (typeof httpStatus === "number" && httpStatus >= HTTP_SERVER_ERROR) {
    return SERVER_UNAVAILABLE_MESSAGE;
  }
  const isHtml = typeof err.data === "string" && HTML_MARKUP.test(err.data);
  if (err.status !== "PARSING_ERROR" && !isHtml) {
    return null;
  }
  // Не-JSON ответ с кодом 4xx — страница nginx (413 на большой файл, 404), а не сбой сервера
  if (httpStatus === HTTP_PAYLOAD_TOO_LARGE) {
    return PAYLOAD_TOO_LARGE_MESSAGE;
  }
  return typeof httpStatus === "number" ? fallback : SERVER_UNAVAILABLE_MESSAGE;
}

function formatDrfPayload(data: unknown, labels: Record<string, string>): string | null {
  if (typeof data === "string") {
    return data.trim() || null;
  }
  if (Array.isArray(data)) {
    return data.map(String).join(", ") || null;
  }
  if (data && typeof data === "object") {
    const lines = Object.entries(data as Record<string, unknown>).map(([field, errors]) => {
      const text = Array.isArray(errors) ? errors.join(", ") : String(errors);
      if (UNLABELED_FIELDS.includes(field)) return text;
      return `${labels[field] ?? field}: ${text}`;
    });
    return lines.length > 0 ? lines.join("\n") : null;
  }
  return null;
}

export function formatApiError(
  err: unknown,
  fallback: string,
  labels: Record<string, string> = {},
): string {
  if (typeof err === "string") {
    return err || fallback;
  }
  const error: QueryError = err && typeof err === "object" ? (err as QueryError) : {};
  const infrastructure = infrastructureMessage(error, fallback);
  if (infrastructure) return infrastructure;

  const payload = formatDrfPayload(error.data, labels);
  if (payload) return payload;

  return typeof error.message === "string" && error.message ? error.message : fallback;
}
