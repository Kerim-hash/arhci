// app/news/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import NewsDetail from "@/components/NewsDetail";
import { fetchApi, type ApiPage } from "@/lib/serverApi";
import { stripHtml } from "@/lib/utils";
import type { NewsDetailRead, NewsListRead } from "@/services/generatedApi";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function loadNews(slug: string) {
  return fetchApi<NewsDetailRead>(`/api/news/${encodeURIComponent(slug)}/`);
}

// Динамические метаданные для SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await loadNews(slug);
  if (!news) return {};

  const description = stripHtml(news.shortDescription || "") || "Новость на нашем сайте";
  return {
    title: news.title,
    description,
    openGraph: {
      title: news.title,
      description,
      images: news.previewImage ? [news.previewImage] : [],
    },
  };
}

// Свежие новости собираются при сборке, остальные — по первому заходу
export async function generateStaticParams() {
  const page = await fetchApi<ApiPage<NewsListRead>>("/api/news/?page=1");
  return (page?.results ?? []).map((item) => ({ slug: item.slug }));
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  if (!slug) notFound();

  const initialNews = await loadNews(slug);
  return <NewsDetail slug={slug} initialNews={initialNews} />;
}
