import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { User } from "@/types/user";

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
}

// TODO: Убрать мок-пользователя перед продакшеном
const initialState: AuthState = {
  isAuthenticated: true,
  loading: false,
  user: {
    id: "dev-user-1",
    email: "specialist@archi.kg",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    name: "Смит Джон",
    role: "company",
    is_verified: true,
    specialistSlug: "smith-john",
    specialistId: 3,
  },
};

export const authReducer = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.isAuthenticated = action.payload;
      state.loading = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    logoutUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
});

export const { setAuth, setLoading, setUser, logoutUser } = authReducer.actions;
export const selectUser = (state: RootState) => state.authSlice.user;
