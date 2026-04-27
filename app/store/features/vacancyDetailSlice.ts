// store/features/vacancyDetailSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { VacancyDetail, SimilarVacancy } from "@/types/vacancy";
import { mockVacancyDetail } from "@/app/mock/vacancyDetail";

interface VacancyDetailState {
  vacancy: VacancyDetail | null;
  similarVacancies: SimilarVacancy[];
  loading: boolean;
  error: string | null;
  isSaved: boolean;
}

const initialState: VacancyDetailState = {
  vacancy: null,
  similarVacancies: [],
  loading: false,
  error: null,
  isSaved: false,
};

// Временно используем мок-данные вместо API
export const fetchVacancyDetail = createAsyncThunk(
  "vacancyDetail/fetch",
  async (id: string) => {
    // Имитация задержки сети
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Возвращаем мок-данные
    return {
      vacancy: mockVacancyDetail,
      similar: mockVacancyDetail.similarVacancies || [],
    };

    // Позже замените на реальный API:
    // const [vacancy, similar] = await Promise.all([
    //   vacancyService.getVacancyById(id),
    //   vacancyService.getSimilarVacancies(id),
    // ]);
    // return { vacancy, similar };
  },
);

export const saveVacancy = createAsyncThunk(
  "vacancyDetail/save",
  async (id: string) => {
    // Имитация сохранения
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true, message: "Сохранено" };
  },
);

const vacancyDetailSlice = createSlice({
  name: "vacancyDetail",
  initialState,
  reducers: {
    clearVacancyDetail: (state) => {
      state.vacancy = null;
      state.similarVacancies = [];
      state.loading = false;
      state.error = null;
    },
    toggleSaved: (state) => {
      if (state.vacancy) {
        state.vacancy.isSaved = !state.vacancy.isSaved;
        state.isSaved = state.vacancy.isSaved;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVacancyDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVacancyDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.vacancy = action.payload.vacancy;
        state.similarVacancies = action.payload.similar;
        state.isSaved = action.payload.vacancy.isSaved;
      })
      .addCase(fetchVacancyDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки";
      })
      .addCase(saveVacancy.fulfilled, (state) => {
        if (state.vacancy) {
          state.vacancy.isSaved = !state.vacancy.isSaved;
          state.isSaved = state.vacancy.isSaved;
        }
      });
  },
});

export const respondToVacancy = createAsyncThunk(
  "vacancyDetail/respond",
  async (id: string) => {
    // Имитация запроса
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, message: "Отклик отправлен" };
  },
);

export const { clearVacancyDetail, toggleSaved } = vacancyDetailSlice.actions;
export default vacancyDetailSlice.reducer;
