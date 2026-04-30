/* eslint-disable @typescript-eslint/no-explicit-any */
// app/news/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsDetail from "@/components/NewsDetail";

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

    const res = await fetch(`http://84.46.243.175:8000/api/news/${slug}/`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return {};

    const news = await res.json();

    return {
      title: news.title,
      description: news.shortDescription || "Новость на нашем сайте",
      openGraph: {
        title: news.title,
        description: news.shortDescription,
        images: news.previewImage ? [news.previewImage] : [],
      },
    };
  } catch {
    return {};
  }
}

// Для статической генерации (опционально)
export async function generateStaticParams() {
  try {
    const res = await fetch("http://84.46.243.175:8000/api/news/");
    const data = await res.json();

    // Проверяем структуру ответа
    const news = data.results || data;

    return news.map((item: any) => ({
      slug: item.slug,
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

  return <NewsDetail slug={slug} />;
}
