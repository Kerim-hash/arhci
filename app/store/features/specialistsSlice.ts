// store/specialistsSlice.ts — Подключен к бэкенду через RTK Query (generatedApi)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  SpecialistListRead,
  SpecialistDetailRead,
} from "@/services/generatedApi";

interface SpecialistsState {
  loading: boolean;
  error: string | null;
}

const initialState: SpecialistsState = {
  loading: false,
  error: null,
};

export const specialistsSlice = createSlice({
  name: "specialists",
  initialState,
  reducers: {},
});

export default specialistsSlice.reducer;

// Re-export хуки из generatedApi
export {
  useApiSpecialistsListQuery,
  useApiSpecialistsRetrieveQuery,
  useApiSpecialistsTopListQuery,
  useApiSpecialistsViewsCreateMutation,
} from "@/services/generatedApi";

// Re-export типы
export type { SpecialistListRead, SpecialistDetailRead };
