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

let refreshInFlight: Promise<boolean> | null = null;

async function refreshTokens(api: BaseQueryApi, extraOptions: ExtraOptions): Promise<boolean> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    tokenStorage.clearTokens();
    return false;
  }

  const result = await anonymousQuery(
    { url: "/auth/refresh-token", method: "POST", body: { refresh_token: refreshToken } },
    api,
    extraOptions,
  );
  const tokens = (result.data ?? {}) as TokenPayload;
  const access = tokens.accessToken ?? tokens.access_token ?? tokens.access;
  const refresh = tokens.refreshToken ?? tokens.refresh_token ?? tokens.refresh;
  if (!access || !refresh) {
    tokenStorage.clearTokens();
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
