import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { tokenStorage } from '@/hooks/storage'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'http://84.46.243.175:8000',
  prepareHeaders: (headers) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
})

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'Articles',
    'Competitions',
    'News',
    'Orders',
    'Projects',
    'Resumes',
    'Specialists',
    'Vacancies',
  ],
  endpoints: () => ({}),
})
