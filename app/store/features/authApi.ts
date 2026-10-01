/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TypeLoginSchema } from "@/schemas/login";
import type { TypeRegisterSchema } from "@/schemas/register";
import { createApi } from "@reduxjs/toolkit/query/react";
import { User } from "@/types/user";
import type { TypeRecoverSchema } from "@/schemas/recover";
import { baseQueryWithReauth } from "@/services/baseQuery";

export interface RequestResetPasswordBody {
  email: string;
}

export interface CheckCodeBody {
  email: string;
  code: string;
}

export interface ChangePasswordBody {
  email: string;
  code: string;
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

export interface ToggleLikeResponse {
  likes: number;
  isLiked: boolean;
}

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

    toggleProjectLike: builder.mutation<ToggleLikeResponse, number>({
      query: (id) => ({
        url: `/api/projects/${id}/like/`,
        method: "POST",
      }),
    }),

    toggleSpecialistLike: builder.mutation<ToggleLikeResponse, number>({
      query: (id) => ({
        url: `/api/specialists/${id}/like/`,
        method: "POST",
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
  useToggleProjectLikeMutation,
  useToggleSpecialistLikeMutation,
} = authApi;
