import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { preconnect } from "react-dom";
import "./globals.css";
import DashboardClientLayout from "./client-layout";
import { Toaster } from "sonner";
import { API_BASE_URL } from "@/lib/api";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const SITE_NAME = "ARDI";
const SITE_DESCRIPTION =
  "Первое архитектурное сообщество Кыргызстана: проекты, специалисты, статьи, конкурсы и работа";

export const metadata: Metadata = {
  title: { default: `${SITE_NAME} — архитектурное сообщество Кыргызстана`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // API живёт на другом домене: соединение (DNS + TCP + TLS — три круга по сети)
  // открываем заранее, пока браузер ещё качает скрипты. Запросы к API идут без
  // cookie, поэтому соединение анонимное.
  preconnect(new URL(API_BASE_URL).origin, { crossOrigin: "anonymous" });

  return (
    <html lang="ru" className={inter.variable}>
      <body className="antialiased bg-[#FBFBFB]">
        <Toaster />
        <DashboardClientLayout>{children}</DashboardClientLayout>
      </body>
    </html>
  );
}
