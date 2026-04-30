// store/competitionsSlice.ts — Подключен к бэкенду через RTK Query (generatedApi)
import { createSlice } from "@reduxjs/toolkit";
import type {
  CompetitionListRead,
  CompetitionDetailRead,
} from "@/services/generatedApi";

interface CompetitionsState {
  loading: boolean;
  error: string | null;
  currentCompetition: CompetitionDetailRead | null;
}

const initialState: CompetitionsState = {
  loading: false,
  error: null,
  currentCompetition: null,
};

const competitionsSlice = createSlice({
  name: "competitions",
  initialState,
  reducers: {
    clearCurrentCompetition: (state) => {
      state.currentCompetition = null;
    },
  },
});

export const { clearCurrentCompetition } = competitionsSlice.actions;
export default competitionsSlice.reducer;

// Re-export хуки из generatedApi
export {
  useApiCompetitionsListQuery,
  useApiCompetitionsRetrieveQuery,
  useApiCompetitionsSlugRetrieveQuery,
  useApiCompetitionsCreateCreateMutation,
  useApiCompetitionsViewsCreateMutation,
} from "@/services/generatedApi";

// Re-export типы
export type { CompetitionListRead, CompetitionDetailRead };