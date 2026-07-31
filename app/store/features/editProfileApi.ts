import { TypeEditProfileSchema } from "@/schemas/editProfile";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/api";

export interface LoginResponse {
  token: string;
}

export const editProfileApi = createApi({
  reducerPath: "editProfileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
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
