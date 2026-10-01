import HomeView from "@/components/home/HomeView";
import { fetchApi } from "@/lib/serverApi";
import type {
  PaginatedArticleListListRead,
  PaginatedNewsListListRead,
  SpecialistListRead,
} from "@/services/generatedApi";

export default async function Page() {
  // Те же запросы, что блоки главной делают на клиенте — только сразу в HTML
  const [initialNews, initialArticles, top] = await Promise.all([
    fetchApi<PaginatedNewsListListRead>("/api/news/?page=1"),
    fetchApi<PaginatedArticleListListRead>("/api/articles/?page=1"),
    // /api/specialists/top/ отдаёт массив, а не страницу { results }
    fetchApi<SpecialistListRead[] | { results?: SpecialistListRead[] }>(
      "/api/specialists/top/?page=1",
    ),
  ]);
  const initialTop = Array.isArray(top) ? top : top?.results;

  return (
    <HomeView initialNews={initialNews} initialArticles={initialArticles} initialTop={initialTop} />
  );
}
