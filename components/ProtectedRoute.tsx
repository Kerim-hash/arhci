"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";
import { tokenStorage } from "@/hooks/storage";

const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/auth/recover"];

// Токен живёт в localStorage, которого нет на сервере. useSyncExternalStore
// отдаёт null на сервере и при гидратации, так что первый рендер совпадает,
// а на клиенте значение читается заново при каждом рендере.
const subscribeToStorage = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};
const getHasToken = (): boolean | null => !!tokenStorage.getAccessToken();
const getServerHasToken = (): boolean | null => null;

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasToken = useSyncExternalStore(subscribeToStorage, getHasToken, getServerHasToken);

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const shouldRedirect =
    !isPublicRoute && hasToken !== null && (!hasToken || (!loading && !isAuthenticated));

  useEffect(() => {
    if (shouldRedirect) {
      router.replace("/auth/login");
    }
  }, [shouldRedirect, router]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (hasToken === null || (hasToken && loading)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (shouldRedirect) {
    return null;
  }

  return <>{children}</>;
};
