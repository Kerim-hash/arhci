import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./store/features/authApi";
import { apiSlice } from "@/services/api";
import { authReducer } from "./auth/model/authSlice";
import { editProfileApi } from "./store/features/editProfileApi";
import vacanciesReducer from "./work/model/vacanciesSlice";
import fetchVacancy from "./store/features/ordersSlice";
import fetchVacancyDetail from "./store/features/vacancyDetailSlice";
import appReducer from "./store/features/appSlice";
import specialistsReducer from "./store/features/specialistsSlice";
import projectsReducer from "./store/features/projectsSlice";
import competitionsReducer from "./store/features/competitionsSlice";
import resumesReducer from "./store/features/resumesSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [authReducer.reducerPath]: authReducer.reducer,
    [editProfileApi.reducerPath]: editProfileApi.reducer,
    vacancies: vacanciesReducer,
    vacancyDetail: fetchVacancyDetail,
    orders: fetchVacancy,
    app: appReducer,
    specialists: specialistsReducer,
    projects: projectsReducer,
    competitions: competitionsReducer,
    resumes: resumesReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      editProfileApi.middleware,
      apiSlice.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
