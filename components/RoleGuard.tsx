"use client";

import { useRole } from "@/hooks/use-role";
import { UserRole } from "@/types/user";
import React from "react";

interface RoleGuardProps {
  /** Роль, которая имеет доступ к содержимому */
  role: UserRole;
  /** Содержимое, отображаемое при совпадении роли */
  children: React.ReactNode;
  /** Альтернативный контент, если роль не совпадает */
  fallback?: React.ReactNode;
}

/**
 * Компонент для условного отображения контента по роли пользователя.
 *
 * Пример:
 * ```tsx
 * <RoleGuard role="specialist">
 *   <Button>Откликнуться</Button>
 * </RoleGuard>
 * ```
 */
export function RoleGuard({ role, children, fallback = null }: RoleGuardProps) {
  const { role: userRole } = useRole();

  if (userRole !== role) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
