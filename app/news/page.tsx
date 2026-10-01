import type { Metadata } from "next";

import { fetchApi } from "@/lib/serverApi";
import type { PaginatedNewsListListRead } from "@/services/generatedApi";

import NewsPageClient from "./NewsPageClient";

export const metadata: Metadata = {
  title: "Новости",
  description: "Новости архитектуры и строительства Кыргызстана",
};

export default async function NewsPage() {
  const initialPage = await fetchApi<PaginatedNewsListListRead>("/api/news/?page=1");
  return <NewsPageClient initialPage={initialPage} />;
}
