/**
 * Единственный источник адреса бэкенда.
 *
 * Значение берётся только из NEXT_PUBLIC_SERVER_URL — запасного адреса нет
 * намеренно: раньше хардкод `https://api.ardi.kg` приводил к тому, что часть
 * страниц молча ходила в прод даже с локального дева.
 *
 * NEXT_PUBLIC_* подставляется на этапе СБОРКИ, поэтому переменная нужна и при
 * `npm run dev`, и при `npm run build` / сборке Docker-образа (см. build-arg
 * NEXT_PUBLIC_SERVER_URL в Dockerfile и docker-compose.yml).
 */
const rawServerUrl = process.env.NEXT_PUBLIC_SERVER_URL;

if (!rawServerUrl) {
  throw new Error(
    "NEXT_PUBLIC_SERVER_URL не задан. Укажите адрес API в .env.local для локальной " +
      "разработки или передайте build-arg NEXT_PUBLIC_SERVER_URL при сборке образа.",
  );
}

/** Базовый адрес API без завершающего слэша, например `https://api.ardi.kg`. */
export const API_BASE_URL = rawServerUrl.replace(/\/+$/, "");

/**
 * Собирает абсолютный адрес к бэкенду.
 * Абсолютные ссылки и data:/blob: возвращаются как есть — это удобно для
 * значений, которые приходят из API уже полными.
 */
export function apiUrl(path: string): string {
  const value = (path || "").trim();
  if (!value) return "";
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }
  return `${API_BASE_URL}/${value.replace(/^\/+/, "")}`;
}
