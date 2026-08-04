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
import RichContent from "@/components/content/RichContent";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageFit, setImageFit] = useState<"cover" | "contain">("cover");
  const [aspectRatio, setAspectRatio] = useState<"3/2" | "16/9" | "auto">("3/2");

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
            {currentProject.specialistName && (
              <div>
                <h2 className="font-semibold text-lg">
                  {currentProject.specialistName}
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
                {new Date(currentProject.createdAt).toLocaleDateString("ru-RU")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{currentProject.views || 0} просмотров</span>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Галерея изображений в виде слайдера */}
        {(() => {
          const images = (currentProject.images as any[]) || [];
          
          const prevImage = () => {
            setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
          };

          const nextImage = () => {
            setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
          };

          const getSliderClass = () => {
            switch (aspectRatio) {
              case "16/9":
                return "aspect-[16/9] w-full max-h-[500px]";
              case "auto":
                return "h-[500px] w-full";
              default:
                return "aspect-[3/2] w-full max-h-[600px]";
            }
          };

          if (images.length === 0) return null;

          return (
            <div className="mb-8 space-y-4">
              {/* Панель настроек размера */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">Пропорции:</span>
                  <div className="flex bg-gray-200 p-0.5 rounded-md text-xs">
                    {(["3/2", "16/9", "auto"] as const).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                          aspectRatio === ratio
                            ? "bg-white text-gray-900 font-medium shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {ratio === "3/2" ? "3:2" : ratio === "16/9" ? "16:9" : "Авто"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">Отображение:</span>
                  <div className="flex bg-gray-200 p-0.5 rounded-md text-xs">
                    {(["cover", "contain"] as const).map((fit) => (
                      <button
                        key={fit}
                        onClick={() => setImageFit(fit)}
                        className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                          imageFit === fit
                            ? "bg-white text-gray-900 font-medium shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {fit === "cover" ? "Заполнить" : "Вписать"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Главный вид слайдера */}
              <div className="relative group">
                <div className={`relative rounded-lg overflow-hidden bg-black/5 ${getSliderClass()}`}>
                  <Image
                    src={images[activeIndex]?.url || images[activeIndex]?.image}
                    alt={images[activeIndex]?.alt || `${currentProject.title} - ${activeIndex + 1}`}
                    fill
                    className={`transition-all duration-300 ${
                      imageFit === "cover" ? "object-cover" : "object-contain"
                    }`}
                    priority
                  />
                </div>

                {/* Стрелки навигации */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full transition-colors cursor-pointer z-10"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full transition-colors cursor-pointer z-10"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Номер слайда */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full font-medium z-10">
                    {activeIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Эскизы */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {images.map((img, index) => (
                    <button
                      key={img.id || index}
                      onClick={() => setActiveIndex(index)}
                      className={`relative w-20 h-14 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                        activeIndex === index ? "border-primary scale-[1.02]" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img.url || img.image}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Описание проекта */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Описание проекта</h2>
          <div className="prose max-w-none">
            <RichContent
              className="ck-content text-[#333333] leading-relaxed"
              html={currentProject.description || ""}
            />
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
