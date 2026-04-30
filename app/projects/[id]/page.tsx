// app/projects/[id]/page.tsx (обновленная версия с модалкой)

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  useApiProjectsRetrieveQuery,
  useApiProjectsViewsCreateMutation,
} from "@/services/generatedApi";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Calendar,
  Share2,
  Heart,
} from "lucide-react";
import ShareModal from "../components/ShareModal";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const projectId = parseInt(id);

  const { data: currentProject, isLoading } = useApiProjectsRetrieveQuery(
    { id: projectId },
    { skip: isNaN(projectId) }
  );
  const [incrementViews] = useApiProjectsViewsCreateMutation();

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (currentProject) {
      incrementViews({ id: projectId });
    }
  }, [currentProject, projectId, incrementViews]);

  const handleLike = () => {
    if (isLiked) {
      setLikesCount((prev) => prev - 1);
    } else {
      setLikesCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  if (isLoading || !currentProject) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-8">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="text-[#666666] mt-4">Загрузка проекта...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="container mx-auto relative px-4 sm:px-6 py-8">
        {/* Навигация */}
        <div className="mb-6">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <Link href="/projects" className="hover:text-gray-700">
              Проекты
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{currentProject.title}</span>
          </nav>
        </div>

        {/* Шапка с автором */}
        <div className="flex items-center justify-between mb-20 mt-6">
          <div className="flex items-center gap-4">
            {currentProject.specialist_name && (
              <div>
                <h2 className="font-semibold text-lg">
                  {currentProject.specialist_name}
                </h2>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isOwner && (
              <Button variant="outline" size="sm">
                Изменить
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              <span className="hidden md:block">Поделиться</span>
            </Button>
          </div>
        </div>

        {/* Заголовок и статистика */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            {currentProject.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-[#666666]">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(currentProject.created_at).toLocaleDateString("ru-RU")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{currentProject.views || 0} просмотров</span>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Галерея изображений */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 pb-4">
            {currentProject.images &&
              (currentProject.images as any[]).map((image: any, index: number) => (
                <div
                  key={image.id || index}
                  className="relative w-[300px] md:w-[400px] lg:w-full h-full flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={image.url || image.image}
                    alt={image.alt || currentProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Описание проекта */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Описание проекта</h2>
          <div className="prose max-w-none">
            <p className="text-[#333333] leading-relaxed whitespace-pre-wrap">
              {currentProject.description}
            </p>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Кнопка лайк */}
        <div className="flex justify-center">
          <Button
            onClick={handleLike}
            variant={isLiked ? "default" : "outline"}
            size="lg"
            className={`gap-2 ${isLiked ? "bg-red-500 hover:bg-red-600" : ""}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`} />
            {likesCount}{" "}
            {likesCount === 1
              ? "лайк"
              : likesCount > 1 && likesCount < 5
                ? "лайка"
                : "лайков"}
          </Button>
        </div>
      </section>

      {/* Модалка поделиться */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        project={currentProject as any}
        specialist={null}
      />
    </>
  );
}
