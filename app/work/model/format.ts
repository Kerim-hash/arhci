// app/work/model/format.ts
//
// Хелперы для отображения полей вакансий, резюме и заказов. Бэкенд отдаёт
// JSON-поля (`programs`, `keySkills`, `duties`…) как `any`, а зарплату —
// нулями вместо «не указано», поэтому выводим их только после проверки.

/** Возвращает массив строк, если значение им является, иначе пустой массив. */
export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

/**
 * Диапазон зарплаты для карточек и страниц: «от 50 000 сом», «до 80 000 сом»,
 * «50 000 — 80 000 сом». Если обе границы пустые или нулевые — `null`.
 */
export function formatSalaryRange(
  from?: number | null,
  to?: number | null,
  currency?: string | null,
): string | null {
  const unit = currency || "сом";
  const hasFrom = typeof from === "number" && from > 0;
  const hasTo = typeof to === "number" && to > 0;
  if (hasFrom && hasTo) return `${from.toLocaleString()} — ${to.toLocaleString()} ${unit}`;
  if (hasFrom) return `от ${from.toLocaleString()} ${unit}`;
  if (hasTo) return `до ${to.toLocaleString()} ${unit}`;
  return null;
}
