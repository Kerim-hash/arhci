// app/projects/create/page.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ImageIcon, Type, X, GripVertical, ArrowLeft, Eye, Calendar } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import { useApiProjectsCreateCreateMutation } from "@/services/generatedApi";
import Link from "next/link";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

export default function CreateProjectPage() {
  const router = useRouter();
  const [createProject] = useApiProjectsCreateCreateMutation();
  const user = useAppSelector((state) => state.authSlice.user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeBlock, setActiveBlock] = useState<"image" | "text" | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: UploadedImage[] = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
      }));

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !user) return;

    setIsSubmitting(true);

    try {
      await createProject({
        projectCreate: {
          title,
          description,
          images: images.map((img) => img.preview),
        },
      }).unwrap();
      router.push(`/specialists/architects/${user.specialistSlug}`);
    } catch (error) {
      console.error("Ошибка создания проекта:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Предварительный просмотр
  if (showPreview) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-8">
        {/* Кнопка назад */}
        <div className="mb-6">
          <Button
            variant="outline"
            className="rounded-[40px] gap-2"
            onClick={() => setShowPreview(false)}
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к редактированию
          </Button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-sm text-yellow-800">
          Это предварительный просмотр. Так будет выглядеть ваш проект после публикации.
        </div>

        {/* Шапка с автором */}
        <div className="flex items-center justify-between mb-20 mt-6">
          <div className="flex items-center gap-4">
            <Image
              src={user?.image || "/avatar3.png"}
              width={80}
              height={80}
              alt={user?.name || ""}
              className="rounded-full w-20 h-20 object-cover"
            />
            <div>
              <h2 className="font-semibold text-lg">{user?.name}</h2>
              <p className="text-sm text-[#666666]">Архитектор</p>
            </div>
          </div>
        </div>

        {/* Заголовок и статистика */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{title}</h1>
          <div className="flex items-center gap-6 text-sm text-[#666666]">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString("ru-RU")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>0 просмотров</span>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Галерея изображений */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 pb-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="relative w-full rounded-lg overflow-hidden bg-gray-100"
              >
                <img
                  src={img.preview}
                  alt={`${title} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Описание проекта */}
        {description && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Описание проекта</h2>
            <div className="prose max-w-none">
              <p className="text-[#333333] leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            </div>
          </div>
        )}

        <Separator className="mb-6" />

        {/* Кнопки */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            className="rounded-[40px] gap-2"
            onClick={() => setShowPreview(false)}
          >
            <ArrowLeft className="w-4 h-4" />
            Редактировать
          </Button>
          <Button
            className="rounded-[40px]"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Создание..." : "Опубликовать"}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8 max-w-[900px]">
      {/* Навигация */}
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/specialists/architects/${user?.specialistSlug}`} className="hover:text-gray-700">
            Мой профиль
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Создать проект</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая часть — форма */}
        <div className="lg:col-span-2 space-y-6">
          {/* Заголовок */}
          <div>
            <label className="text-sm font-medium text-[#333] mb-2 block">
              Заголовок статьи
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Напишите заголовок статьи"
              className="text-base"
            />
          </div>

          {/* Область загрузки изображений */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-[#333] bg-gray-50"
                : "border-[#E0E0E0] bg-white"
            }`}
          >
            {images.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-[#949494] mb-6">
                  Перетащите изображения сюда или нажмите, чтобы загрузить
                </p>
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                  <ImageIcon className="w-8 h-8 text-[#949494]" />
                </div>
                <Button
                  variant="outline"
                  className="rounded-[40px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Загрузить
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Превью загруженных изображений */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <div
                      key={img.id}
                      className="relative group rounded-lg overflow-hidden aspect-video"
                    >
                      <img
                        src={img.preview}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                          Обложка
                        </span>
                      )}
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="rounded-[40px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Добавить ещё
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {/* Описание */}
          {activeBlock === "text" && (
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Описание проекта
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Расскажите о проекте..."
                rows={6}
                className="w-full border rounded-lg p-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#333] focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Правая часть — панель инструментов */}
        <div className="lg:col-span-1 space-y-4">
          {/* Кнопки блоков */}
          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 flex flex-col items-center gap-2 border rounded-lg p-4 transition-colors hover:bg-gray-50 ${
                activeBlock === "image"
                  ? "border-[#333] bg-gray-50"
                  : "border-[#E0E0E0]"
              }`}
            >
              <ImageIcon className="w-5 h-5 text-[#666]" />
              <span className="text-xs text-[#666]">Изображение</span>
            </button>
            <button
              onClick={() =>
                setActiveBlock(activeBlock === "text" ? null : "text")
              }
              className={`flex-1 flex flex-col items-center gap-2 border rounded-lg p-4 transition-colors hover:bg-gray-50 ${
                activeBlock === "text"
                  ? "border-[#333] bg-gray-50"
                  : "border-[#E0E0E0]"
              }`}
            >
              <Type className="w-5 h-5 text-[#666]" />
              <span className="text-xs text-[#666]">Текст</span>
            </button>
          </div>

          {/* Действия */}
          <div className="space-y-3 pt-4">
            <Button
              variant="outline"
              className="w-full rounded-[40px]"
              disabled={!title.trim() || images.length === 0}
              onClick={() => setShowPreview(true)}
            >
              Предварительный просмотр
            </Button>
            <Button
              className="w-full rounded-[40px]"
              onClick={handleSubmit}
              disabled={!title.trim() || images.length === 0 || isSubmitting}
            >
              {isSubmitting ? "Создание..." : "Продолжить"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
