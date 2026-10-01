/**
 * Даты для разметки, которая рендерится и на сервере, и в браузере.
 *
 * Пояс задан явно: сервер живёт в UTC, посетитель — в своём поясе, и запись,
 * созданная около полуночи, без этого получила бы разные даты в серверном
 * HTML и после гидрации (React счёл бы это расхождением разметки).
 */
const TIME_ZONE = "Asia/Bishkek";

function format(value: string | null | undefined, options: Intl.DateTimeFormatOptions): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ru-RU", { timeZone: TIME_ZONE, ...options });
}

/** «15 марта 2026 г.» */
export function formatLongDate(value: string | null | undefined): string {
  return format(value, { year: "numeric", month: "long", day: "numeric" });
}

/** «15 марта» */
export function formatDayMonth(value: string | null | undefined): string {
  return format(value, { month: "long", day: "numeric" });
}

/** «15.03.2026» */
export function formatShortDate(value: string | null | undefined): string {
  return format(value, {});
}
