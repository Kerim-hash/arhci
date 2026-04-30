// store/features/resumesSlice.ts — Подключен к бэкенду через RTK Query (generatedApi)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  ResumeListRead,
  ResumeDetailRead,
} from "@/services/generatedApi";

interface ResumesFilters {
  specializations: string[];
  software: string[];
  experience: string;
  employmentType: string[];
  incomeFrom: string;
  incomeTo: string;
  hasIncome: boolean;
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
    software: [],
    experience: "",
    employmentType: [],
    incomeFrom: "",
    incomeTo: "",
    hasIncome: false,
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

// Backward-compatible типы для компонентов, которые уже используют эти интерфейсы
export interface WorkExperience {
  company: string;
  position?: string;
  startDate: string;
  endDate: string;
  duties: string[];
  achievement?: string;
}

export interface Resume {
  id: number;
  name: string;
  salaryFrom: number;
  salaryTo: number;
  experience: string;
  specialization: string[];
  category: string;
  description: string;
  about: string;
  software: string[];
  employmentType: string[];
  region: string;
  avatar: string;
  workPlace: string;
  employment: string;
  schedule: string;
  phone: string;
  email: string;
  socialLinks: string[];
  keySkills: string[];
  workExperience: WorkExperience[];
}
