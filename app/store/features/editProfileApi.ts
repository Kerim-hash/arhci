import type { TypeEditProfileSchema } from "@/schemas/editProfile";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/services/baseQuery";

export interface LoginResponse {
  token: string;
}

export interface ChangePasswordBody {
  currentPassword: string;
  password: string;
}

export interface ChangeEmailBody {
  email: string;
  /** Текущий пароль — бэкенд требует его для смены email. */
  password: string;
}

export const editProfileApi = createApi({
  reducerPath: "editProfileApi",
  // Общий baseQuery: просроченный access-токен обновляется, а не роняет запрос.
  baseQuery: baseQueryWithReauth,
  tagTypes: ["UserProfile"], // Добавляем тег
  endpoints: (builder) => ({
    editProfile: builder.mutation<LoginResponse, FormData | TypeEditProfileSchema>({
      query: (body) => {
        let finalBody = body;
        if (!(body instanceof FormData)) {
          const formData = new FormData();
          Object.entries(body).forEach(([key, val]) => {
            if (val !== undefined && val !== null) {
              formData.append(key, String(val));
            }
          });
          finalBody = formData;
        }
        return {
          url: "/edit-profile",
          method: "POST",
          body: finalBody,
        };
      },
      invalidatesTags: ["UserProfile"], // Инвалидируем кэш
    }),

    checkPassword: builder.mutation<void, { password: string }>({
      query: (body) => ({
        url: "/auth/check-password",
        method: "POST",
        body,
      }),
    }),

    changePassword: builder.mutation<void, ChangePasswordBody>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserProfile"],
    }),

    changeEmail: builder.mutation<void, ChangeEmailBody>({
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
