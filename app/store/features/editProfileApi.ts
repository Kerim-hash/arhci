import { TypeEditProfileSchema } from "@/schemas/editProfile";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface LoginResponse {
  token: string;
}

export const editProfileApi = createApi({
  reducerPath: "editProfileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["UserProfile"], // Добавляем тег
  endpoints: (builder) => ({
    editProfile: builder.mutation<LoginResponse, TypeEditProfileSchema>({
      query: (credentials) => ({
        url: "/edit-profile",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["UserProfile"], // Инвалидируем кэш
    }),

    checkPassword: builder.mutation<void, { password: string }>({
      query: (body) => ({
        url: "/auth/check-password",
        method: "POST",
        body,
      }),
    }),

    changePassword: builder.mutation<void, { password: string }>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserProfile"],
    }),

    changeEmail: builder.mutation<void, { email: string }>({
      query: (body) => ({
        url: "/users/change-email",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserProfile"],
    }),
  }),
});

export const {
  useEditProfileMutation,
  useCheckPasswordMutation,
  useChangePasswordMutation,
  useChangeEmailMutation,
} = editProfileApi;
