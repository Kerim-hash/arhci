// store/features/resumesSlice.ts — Подключен к бэкенду через RTK Query (generatedApi)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  ResumeListRead,
  ResumeDetailRead,
} from "@/services/generatedApi";

// Только то, что умеет фильтровать бэкенд: specialization, experience,
// region, salary_from (плюс search). Остальные поля формы не фильтруются.
interface ResumesFilters {
  specializations: string[];
  experience: string;
  incomeFrom: string;
  region: string;
}

interface ResumesState {
  currentResume: ResumeDetailRead | null;
  searchQuery: string;
  filters: ResumesFilters;
  loading: boolean;
  error: string | null;
}

const initialState: ResumesState = {
  currentResume: null,
  searchQuery: "",
  filters: {
    specializations: [],
    experience: "",
    incomeFrom: "",
    region: "",
  },
  loading: false,
  error: null,
};

const resumesSlice = createSlice({
  name: "resumes",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    updateFilters: (
      state,
      action: PayloadAction<Partial<ResumesFilters>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentResume: (state) => {
      state.currentResume = null;
    },
  },
});

export const { setSearchQuery, updateFilters, resetFilters, clearCurrentResume } =
  resumesSlice.actions;
export default resumesSlice.reducer;

// Re-export хуки из generatedApi
export {
  useApiResumesListQuery,
  useApiResumesRetrieveQuery,
  useApiResumesCreateCreateMutation,
} from "@/services/generatedApi";

// Re-export типы
export type { ResumeListRead, ResumeDetailRead };
