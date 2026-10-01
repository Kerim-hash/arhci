import {
  fetchBaseQuery,
  type BaseQueryApi,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { tokenStorage } from "@/hooks/storage";
import { API_BASE_URL } from "@/lib/api";

/**
 * Общий baseQuery для всех RTK Query-слайсов.
 *
 * Access-токен живёт сутки. Когда он протухает, бэкенд отвечает 401 на любой
 * запрос с ним — в том числе на публичные списки и даже на сам
 * /auth/refresh-token, если заголовок Authorization попадёт и туда. Поэтому:
 *  1) обновление токена уходит без Authorization;
 *  2) одновременные 401 делят один refresh-запрос;
 *  3) если обновить не удалось, токены чистятся и запрос повторяется анонимно —
 *     публичные данные должны открываться и без входа.
 *
 * Использованный refresh-токен бэкенд отзывает, поэтому из ответа всегда
 * сохраняется новая пара токенов. Сессия сбрасывается только если сам
 * /auth/refresh-token отклонил токен (400/401/403): сетевой сбой или 5xx
 * не повод разлогинивать пользователя.
 */

const authorizedQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const anonymousQuery = fetchBaseQuery({ baseUrl: API_BASE_URL });

type ExtraOptions = Parameters<typeof anonymousQuery>[2];

type TokenPayload = Partial<
  Record<
    "accessToken" | "access_token" | "access" | "refreshToken" | "refresh_token" | "refresh",
    string
  >
>;

const REFRESH_REJECTED_STATUSES: ReadonlyArray<FetchBaseQueryError["status"]> = [400, 401, 403];

let refreshInFlight: Promise<boolean> | null = null;

/**
 * Полностью завершает сессию: чистит токены, сбрасывает authSlice и кэши
 * RTK Query, чтобы следующий пользователь не увидел чужие «мои» списки.
 *
 * Слайсы импортируются динамически: api.ts и authApi.ts сами импортируют этот
 * файл, а статический цикл сломал бы инициализацию `baseQueryWithReauth`.
 */
async function dropSession(api: BaseQueryApi): Promise<void> {
  tokenStorage.clearTokens();
  const [{ logoutUser }, { apiSlice }, { authApi }] = await Promise.all([
    import("@/app/auth/model/authSlice"),
    import("./api"),
    import("@/app/store/features/authApi"),
  ]);
  api.dispatch(logoutUser());
  api.dispatch(apiSlice.util.resetApiState());
  api.dispatch(authApi.util.resetApiState());
}

async function refreshTokens(api: BaseQueryApi, extraOptions: ExtraOptions): Promise<boolean> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    await dropSession(api);
    return false;
  }

  const result = await anonymousQuery(
    { url: "/auth/refresh-token", method: "POST", body: { refreshToken } },
    api,
    extraOptions,
  );
  if (result.error) {
    if (REFRESH_REJECTED_STATUSES.includes(result.error.status)) {
      await dropSession(api);
    }
    return false;
  }

  const tokens = (result.data ?? {}) as TokenPayload;
  const access = tokens.accessToken ?? tokens.access_token ?? tokens.access;
  const refresh = tokens.refreshToken ?? tokens.refresh_token ?? tokens.refresh;
  if (!access) {
    return false;
  }
  tokenStorage.setTokens(access, refresh);
  return true;
}

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const usedToken = tokenStorage.getAccessToken();
  const result = await authorizedQuery(args, api, extraOptions);
  if (!usedToken || result.error?.status !== 401) {
    return result;
  }

  // Пока запрос летел, токен уже мог обновить другой запрос — просто повторяем.
  if (tokenStorage.getAccessToken() !== usedToken) {
    return authorizedQuery(args, api, extraOptions);
  }

  if (!refreshInFlight) {
    refreshInFlight = refreshTokens(api, extraOptions).finally(() => {
      refreshInFlight = null;
    });
  }
  const refreshed = await refreshInFlight;

  return refreshed
    ? authorizedQuery(args, api, extraOptions)
    : anonymousQuery(args, api, extraOptions);
};
