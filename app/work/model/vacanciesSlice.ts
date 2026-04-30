// store/features/vacanciesSlice.ts — Подключен к бэкенду через RTK Query (generatedApi)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  specializations: string[];
  incomeFrom: string;
  incomeTo: string;
  paymentType: "month" | "week" | "day";
  hasIncome: boolean;
  software: string[];
  experience: string;
  employmentType: string[];
  region: string;
}

interface VacanciesState {
  activeTab: string;
  searchQuery: string;
  filters: FiltersState;
}

const initialState: VacanciesState = {
  activeTab: "vacancies",
  searchQuery: "",
  filters: {
    specializations: [],
    incomeFrom: "",
    incomeTo: "",
    paymentType: "month",
    hasIncome: false,
    software: [],
    experience: "",
    employmentType: [],
    region: "all",
  },
};

const vacanciesSlice = createSlice({
  name: "vacancies",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const { setActiveTab, setSearchQuery, updateFilters, resetFilters } =
  vacanciesSlice.actions;
export default vacanciesSlice.reducer;

// Re-export хуки из generatedApi
export {
  useApiVacanciesListQuery,
  useApiVacanciesCreateCreateMutation,
} from "@/services/generatedApi";
