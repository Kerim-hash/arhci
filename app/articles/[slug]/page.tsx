/* eslint-disable @typescript-eslint/no-explicit-any */
// app/articles/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleDetail from "@/components/ArticleDetail";
import { stripHtml } from "@/lib/utils";

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
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://api.ardi.kg";

    const res = await fetch(`${baseUrl}/api/articles/${slug}/`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return {};

    const article = await res.json();
    const shortDesc = stripHtml(article.shortDescription || article.short_description || "") || "Статья на нашем сайте";
    const previewImg = article.previewImage || article.preview_image;

    return {
      title: article.title,
      description: shortDesc,
      openGraph: {
        title: article.title,
        description: shortDesc,
        images: previewImg ? [previewImg] : [],
      },
    };
  } catch {
    return {};
  }
}

// Для статической генерации (опционально)
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://api.ardi.kg";
    const res = await fetch(`${baseUrl}/api/articles/`);
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
