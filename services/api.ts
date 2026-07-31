import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenStorage } from "@/hooks/storage";
import { API_BASE_URL } from "@/lib/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Articles",
    "Competitions",
    "News",
    "Orders",
    "Projects",
    "Resumes",
    "Specialists",
    "Vacancies",
  ],
  endpoints: () => ({}),
});
