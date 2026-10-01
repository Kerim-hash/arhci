// app/articles/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArticleDetail from "@/components/ArticleDetail";
import { fetchApi, type ApiPage } from "@/lib/serverApi";
import { stripHtml } from "@/lib/utils";
import type { ArticleDetailRead, ArticleListRead } from "@/services/generatedApi";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function loadArticle(slug: string) {
  return fetchApi<ArticleDetailRead>(`/api/articles/${encodeURIComponent(slug)}/`);
}

// Динамические метаданные для SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) return {};

  const description = stripHtml(article.shortDescription || "") || "Статья на нашем сайте";
  return {
    title: article.title,
    description,
    openGraph: {
      title: article.title,
      description,
      images: article.previewImage ? [article.previewImage] : [],
    },
  };
}

// Свежие статьи собираются при сборке, остальные — по первому заходу
export async function generateStaticParams() {
  const page = await fetchApi<ApiPage<ArticleListRead>>("/api/articles/?page=1");
  return (page?.results ?? [])
    .filter((article) => article.slug)
    .map((article) => ({ slug: article.slug as string }));
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  if (!slug) notFound();

  // Черновик или статью на модерации сервер не увидит — её покажет клиентский запрос автора
  const initialArticle = await loadArticle(slug);
  return <ArticleDetail slug={slug} initialArticle={initialArticle} />;
}
