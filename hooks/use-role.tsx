"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { UserRole } from "@/types/user";

/**
 * Хук для работы с ролями пользователя.
 * Возвращает текущую роль и удобные флаги.
 */
export const useRole = () => {
  const user = useSelector((state: RootState) => state.authSlice.user);

  const role: UserRole | null = user?.role ?? null;

  return {
    role,
    isSpecialist: role === "specialist",
    isCompany: role === "company",
    isAuthenticated: !!user,
  };
};
