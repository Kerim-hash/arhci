/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypeLoginSchema } from "@/schemas/login";
import { TypeRegisterSchema } from "@/schemas/register";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "@/types/user";
import { tokenStorage } from "@/hooks/storage";
import { TypeRecoverSchema } from "@/schemas/recover";

export interface RequestResetPasswordBody {
  email: string;
}

export interface CheckCodeBody {
  email: string;
  code: string;
}

export interface ChangePasswordBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RegisterResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  prepareHeaders: (headers) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = tokenStorage.getRefreshToken();

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const tokens = refreshResult.data as any;
        const access = tokens.accessToken || tokens.access_token || tokens.access;
        const refresh = tokens.refreshToken || tokens.refresh_token || tokens.refresh;
        if (access && refresh) {
          tokenStorage.setTokens(access, refresh);
          result = await baseQuery(args, api, extraOptions);
        } else {
          tokenStorage.clearTokens();
        }
      } else {
        tokenStorage.clearTokens();
        console.warn("Refresh token failed, user should be logged out");
      }
    } else {
      tokenStorage.clearTokens();
      console.warn("No refresh token available, user should be logged out");
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["UserProfile"],
  endpoints: (builder) => ({
    restoreAccount: builder.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/users/restore",
        method: "POST",
        body: credentials,
      }),
    }),
    events: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "/events",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation<LoginResponse, TypeLoginSchema>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["UserProfile"],
    }),

    registerUser: builder.mutation<RegisterResponse, TypeRegisterSchema>({
      query: (data) => ({
        url: "/auth/register/uk",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserProfile"],
    }),

    getProfile: builder.query<User, void>({
      query: () => "/auth/profile",
      providesTags: ["UserProfile"],
    }),

    requestResetPassword: builder.mutation<void, TypeRecoverSchema>({
      query: (body) => ({
        url: "/auth/request-reset-password/uk",
        method: "POST",
        body,
      }),
    }),

    checkCode: builder.mutation<void, CheckCodeBody>({
      query: (body) => ({
        url: "/auth/check-code",
        method: "POST",
        body,
      }),
    }),

    changePassword: builder.mutation<void, ChangePasswordBody>({
      query: (body) => ({
        url: "/auth/recover-password",
        method: "POST",
        body,
      }),
    }),

    refreshTokens: builder.mutation<
      RefreshTokenResponse,
      { refresh_token: string }
    >({
      query: (body) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterUserMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useRequestResetPasswordMutation,
  useCheckCodeMutation,
  useChangePasswordMutation,
  useRefreshTokensMutation,
  useEventsMutation,
  useRestoreAccountMutation,
} = authApi;
