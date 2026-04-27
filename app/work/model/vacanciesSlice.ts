// store/features/vacanciesSlice.ts (обновленные вакансии)
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Vacancy {
  id: number;
  title: string;
  salaryFrom: number;
  salaryTo: number;
  experience: string;
  company: string;
  address: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
}

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
  vacancies: Vacancy[];
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
  vacancies: [
    {
      id: 1,
      title: "Ведущий архитектор (Lead Architect)",
      salaryFrom: 120000,
      salaryTo: 180000,
      experience: "1-3 года",
      company: "ОСДО Стратегическая компания AP2VV",
      address: "Бишкек, улица Акариба Банкова, 148/3",
    },
    {
      id: 2,
      title: "Архитектор",
      salaryFrom: 120000,
      salaryTo: 180000,
      experience: "1-3 года",
      company: "Актуальное Design Group",
      address: "Бишкек, БЦ «УЗИТ»",
    },
    {
      id: 3,
      title: "Дизайнер интерьера (Senior)",
      salaryFrom: 100000,
      salaryTo: 150000,
      experience: "3-6 лет",
      company: "ОСДО Стратегическая компания AP2VV",
      address: "Бишкек, ул. Космонавта / Подмосковье",
    },
    {
      id: 4,
      title: "Ведущий архитектор (Lead Architect)",
      salaryFrom: 120000,
      salaryTo: 180000,
      experience: "3-6 лет",
      company: "ОСДО Стратегическая компания AP2VV",
      address: "Бишкек, улица Акариба Банкова, 148/3",
    },
    {
      id: 5,
      title: "Архитектор",
      salaryFrom: 0,
      salaryTo: 0,
      experience: "1-3 года",
      company: "Актуальное Design Group",
      address: "Бишкек, БЦ «УЗИТ»",
    },
    {
      id: 6,
      title: "Концепт-архитектор",
      salaryFrom: 140000,
      salaryTo: 190000,
      experience: "Более 8 лет",
      company: "Актуальное Design Group",
      address: "Бишкек, БЦ «УЗИТ»",
    },
    {
      id: 7,
      title: "Архитектор-теплопланист",
      salaryFrom: 90000,
      salaryTo: 130000,
      experience: "5 лет",
      company: "ОСДО Стратегическая компания AP2VV",
      address: "Бишкек, ул. Жаңыз-Жаңыз",
    },
    {
      id: 8,
      title: "Архитектор (Рабочая документация)",
      salaryFrom: 85000,
      salaryTo: 115000,
      experience: "1-3 года",
      company: "СтройИнвест Проект",
      address: "Бишкек, ул. Джамбула",
    },
    {
      id: 9,
      title: "Архитектор (Рабочая документация)",
      salaryFrom: 0,
      salaryTo: 0,
      experience: "По доверенности",
      company: "Обычный проект",
      address: "",
    },
  ],
};

// Async thunks
export const createVacancy = createAsyncThunk(
  "vacancies/createVacancy",
  async (vacancyData: Omit<Vacancy, "id">) => {
    try {
      const response = await fetch("/api/vacancies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vacancyData),
      });
      if (!response.ok) throw new Error("API error");
      return await response.json();
    } catch {
      // Фолбэк — создать локально с временным ID
      return { ...vacancyData, id: Date.now() } as Vacancy;
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(createVacancy.pending, (state) => {
        // можно добавить loading флаг при необходимости
      })
      .addCase(createVacancy.fulfilled, (state, action) => {
        state.vacancies.unshift(action.payload);
      })
      .addCase(createVacancy.rejected, () => {
        // обработка ошибки
      });
  },
});

export const { setActiveTab, setSearchQuery, updateFilters, resetFilters } =
  vacanciesSlice.actions;
export default vacanciesSlice.reducer;
