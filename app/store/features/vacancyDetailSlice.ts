// store/features/vacancyDetailSlice.ts — Подключен к бэкенду через RTK Query (generatedApi)
import { createSlice } from "@reduxjs/toolkit";

interface VacancyDetailState {
  isSaved: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: VacancyDetailState = {
  isSaved: false,
  loading: false,
  error: null,
};

const vacancyDetailSlice = createSlice({
  name: "vacancyDetail",
  initialState,
  reducers: {
    clearVacancyDetail: (state) => {
      state.loading = false;
      state.error = null;
      state.isSaved = false;
    },
    toggleSaved: (state) => {
      state.isSaved = !state.isSaved;
    },
  },
});

export const { clearVacancyDetail, toggleSaved } = vacancyDetailSlice.actions;
export default vacancyDetailSlice.reducer;

// Re-export хуки из generatedApi
export {
  useApiVacanciesRetrieveQuery,
  useApiVacanciesSimilarListQuery,
  useApiVacanciesSaveCreateMutation,
  useApiVacanciesRespondCreateMutation,
} from "@/services/generatedApi";
