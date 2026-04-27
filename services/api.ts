import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getUserData: builder.query<unknown, void>({
      query: () => 'user',
    }),
  }),
})

export const { useGetUserDataQuery } = apiSlice
