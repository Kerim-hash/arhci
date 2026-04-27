"use client";

import { useGetProfileQuery } from "@/app/store/features/authApi";
import { logoutUser, setAuth, setUser } from "@/app/auth/model/authSlice";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { tokenStorage } from "@/hooks/storage";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, loading, user } = useSelector(
    (state: RootState) => state.authSlice,
  );

  const { data, isError, isSuccess, error, refetch, isLoading } =
    useGetProfileQuery(undefined, {
      skip: !tokenStorage.getAccessToken(),
    });

  const handleLogout = useCallback(() => {
    router.push("/auth/login");
    dispatch(logoutUser());
    tokenStorage.clearTokens();
  }, [dispatch, router]);

  const checkAuth = async () => {
    if (tokenStorage.getAccessToken()) {
      await refetch();
    }
  };

  const refreshAuthToken = async (refreshToken: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        },
      );

      if (response.ok) {
        const tokens: { access_token: string; refresh_token: string } =
          await response.json();
        tokenStorage.setTokens(tokens.access_token, tokens.refresh_token);
        await refetch();
        return true;
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      handleLogout();
      return false;
    }
  };

  const loginSuccess = (tokens: {
    access_token: string;
    refresh_token: string;
  }) => {
    try {
      tokenStorage.setTokens(tokens.access_token, tokens.refresh_token);
      dispatch(setAuth(true));
      refetch();
      router.push("/");
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
    if (isError) {
      if ("status" in error && error.status !== 401) {
        console.warn("Authentication error, logging out:", error);
        handleLogout();
      }
    }
  }, [isError, error, handleLogout]);

  return {
    isAuthenticated: isAuthenticated && !isError,
    loading: isLoading || loading,
    user,
    checkAuth,
    refreshAuthToken,
    loginSuccess,
    logout,
  };
};
