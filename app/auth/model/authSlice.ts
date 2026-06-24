import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { User } from "@/types/user";

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  user: null,
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
