"use client";

import { authApi, useGetProfileQuery } from "@/app/store/features/authApi";
import { logoutUser, setAuth, setUser } from "@/app/auth/model/authSlice";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { tokenStorage } from "@/hooks/storage";
import { useRouter } from "next/navigation";
import { apiSlice } from "@/services/api";

/** Ответ логина/регистрации: бэкенд отдаёт camelCase, старые варианты оставлены на всякий случай. */
type AuthTokens = Partial<
  Record<
    "accessToken" | "access_token" | "access" | "refreshToken" | "refresh_token" | "refresh",
    string
  >
>;

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, loading, user } = useSelector(
    (state: RootState) => state.authSlice,
  );

  const { data, isError, isSuccess, error, isLoading } =
    useGetProfileQuery(undefined, {
      skip: !tokenStorage.getAccessToken(),
    });

  const handleLogout = useCallback(() => {
    tokenStorage.clearTokens();
    dispatch(logoutUser());
    // Сбрасываем кэши RTK Query, чтобы следующий пользователь не увидел
    // «мои» списки и профиль предыдущего.
    dispatch(apiSlice.util.resetApiState());
    dispatch(authApi.util.resetApiState());
    router.push("/auth/login");
  }, [dispatch, router]);

  const loginSuccess = (tokens: AuthTokens) => {
    try {
      const access = tokens.accessToken || tokens.access_token || tokens.access;
      const refresh =
        tokens.refreshToken || tokens.refresh_token || tokens.refresh;

      if (access && refresh) {
        tokenStorage.setTokens(access, refresh);
        dispatch(setAuth(true));
        // refetch();
        router.push("/");
      } else {
        console.error("No valid tokens found in response:", tokens);
      }
    } catch (error) {
      console.error("Error in loginSuccess:", error);
    }
  };

  const logout = () => {
    handleLogout();
  };

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setAuth(true));
      dispatch(setUser(data));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (!isError) return;
    const status = error && "status" in error ? error.status : undefined;
    // 500 или сетевой сбой — не повод разлогинивать. Выходим только когда
    // профиль отвечает 401 и refresh-токена больше нет: baseQueryWithReauth
    // чистит токены, если /auth/refresh-token отклонил их.
    if (status === 401 && !tokenStorage.getRefreshToken()) {
      handleLogout();
    }
  }, [isError, error, handleLogout]);

  return {
    // isSuccess страхует один рендер между ответом профиля и setAuth(true)
    // в эффекте выше — иначе ProtectedRoute успевает увидеть «не вошёл».
    isAuthenticated: (isAuthenticated || isSuccess) && !isError,
    loading: isLoading || loading,
    user,
    loginSuccess,
    logout,
  };
};
