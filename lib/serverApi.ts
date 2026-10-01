import { API_BASE_URL } from "@/lib/api";

/** Сколько секунд страница может отдавать закэшированный ответ API. */
export const REVALIDATE_SECONDS = 60;

const TIMEOUT_MS = 4000;

/**
 * Запрос к API из серверного компонента — данные для первого экрана.
 *
 * Клиент отрисовывает всё сам через RTK Query, но до этого браузеру нужно
 * скачать JS, установить соединение с API и дождаться ответа — на канале с
 * задержкой 300+ мс это секунды пустой страницы. Сервер рядом с API, поэтому
 * кладёт первую порцию данных прямо в HTML.
 *
 * Возвращает `undefined` при любой ошибке: страница тогда просто отрисуется
 * по-старому, с клиентской загрузкой. Запрос анонимный — черновики и записи
 * на модерации автор увидит после клиентского запроса с токеном.
 */
export async function fetchApi<T>(path: string): Promise<T | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
      // 404 — обычное дело (запись на модерации или удалена), остальное стоит видеть в логах
      if (response.status !== 404) {
        console.warn(`[serverApi] ${path}: HTTP ${response.status}`);
      }
      return undefined;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.warn(`[serverApi] ${path}: ${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  }
}

/** Страница списка DRF. */
export interface ApiPage<T> {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}
