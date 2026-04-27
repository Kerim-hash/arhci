"use client";

import { Provider } from "react-redux";
import Header from "./layout/header";
import Footer from "./layout/footer";
import { store } from "./store";
import { usePathname } from "next/navigation";

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth/");

  // Если это страница авторизации - рендерим только children без Header/Footer
  if (isAuthPage) {
    return <Provider store={store}>{children}</Provider>;
  }

  // Для всех остальных страниц - с Header и Footer
  return (
    <Provider store={store}>
      <Header />
      <div className="mt-23 md:mt-27.5">{children}</div>
      <Footer />
    </Provider>
  );
}
