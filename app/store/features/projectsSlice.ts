// store/projectsSlice.ts — Подключен к бэкенду через RTK Query (generatedApi)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generatedApi } from "@/services/generatedApi";
import type {
  ProjectListRead,
  ProjectDetailRead,
} from "@/services/generatedApi";

// Локальный стейт для UI (фильтры, текущий проект)
interface ProjectsState {
  loading: boolean;
  error: string | null;
  currentProject: ProjectDetailRead | null;
}

const initialState: ProjectsState = {
  loading: false,
  error: null,
  currentProject: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    setCurrentProject: (state, action: PayloadAction<ProjectDetailRead>) => {
      state.currentProject = action.payload;
    },
  },
});

export const { clearCurrentProject, setCurrentProject } = projectsSlice.actions;
export default projectsSlice.reducer;

// Re-export хуки из generatedApi для удобства
export {
  useApiProjectsListQuery,
  useApiProjectsRetrieveQuery,
  useApiProjectsCreateCreateMutation,
  useApiProjectsSpecialistListQuery,
  useApiProjectsViewsCreateMutation,
} from "@/services/generatedApi";

// Re-export типы
export type { ProjectListRead, ProjectDetailRead };
