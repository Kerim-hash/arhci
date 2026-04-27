"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";
import { tokenStorage } from "@/hooks/storage";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);

  const publicRoutes = [
    "/auth/sign_in",
    "/auth/sign_up",
    "/auth/recover",
    "/auth/verify",
    "/auth/restore-account",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  useEffect(() => {
    if (isPublicRoute) {
      setAuthChecked(true);
      return;
    }

    if (!tokenStorage.getAccessToken()) {
      router.replace("/auth/login");
      return;
    }

    const timer = setTimeout(() => {
      setAuthChecked(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPublicRoute, router, pathname]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (!authChecked || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.replace("/auth/login");
    return null;
  }

  return <>{children}</>;
};
