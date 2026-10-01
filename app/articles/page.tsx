import type { Metadata } from "next";

import { fetchApi } from "@/lib/serverApi";
import type { PaginatedArticleListListRead } from "@/services/generatedApi";

import ArticlesPageClient from "./ArticlesPageClient";

export const metadata: Metadata = {
  title: "Статьи",
  description: "Статьи об архитектуре, проектировании и дизайне",
};

export default async function ArticlesPage() {
  const initialPage = await fetchApi<PaginatedArticleListListRead>("/api/articles/?page=1");
  return <ArticlesPageClient initialPage={initialPage} />;
}
