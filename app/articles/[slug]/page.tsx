/* eslint-disable @typescript-eslint/no-explicit-any */
// app/articles/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleDetail from "@/components/ArticleDetail";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Динамические метаданные для SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;

    const res = await fetch(`http://84.46.243.175:8000/api/articles/${slug}/`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return {};

    const article = await res.json();

    return {
      title: article.title,
      description: article.shortDescription || "Статья на нашем сайте",
      openGraph: {
        title: article.title,
        description: article.shortDescription,
        images: article.previewImage ? [article.previewImage] : [],
      },
    };
  } catch {
    return {};
  }
}

// Для статической генерации (опционально)
export async function generateStaticParams() {
  try {
    const res = await fetch("http://84.46.243.175:8000/api/articles/");
    const data = await res.json();

    // Проверяем структуру ответа
    const articles = data.results || data;

    return articles.map((article: any) => ({
      slug: article.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  return <ArticleDetail slug={slug} />;
}
