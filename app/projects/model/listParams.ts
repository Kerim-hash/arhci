// Общие параметры списка проектов: ими пользуются и серверная страница
// (первая порция данных), и клиентский список — запросы должны совпадать.

export const DEFAULT_PROJECTS_ORDERING = "-created_at";

/** id специалиста из `?specialist=`; `null` — если параметра нет или он не число. */
export function parseSpecialistId(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}
