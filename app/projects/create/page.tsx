// app/projects/create/page.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ImageIcon, Type, ArrowLeft, Eye, Calendar, FileDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { authApi } from "@/app/store/features/authApi";
import {
  useApiProjectsCreateCreateMutation,
  type ProjectCreateWrite,
} from "@/services/generatedApi";
import { stripHtml } from "@/lib/utils";
import { SPECIALTIES } from "@/lib/specialties";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ProjectImageDropzone, useUploadedImages } from "../components/ProjectImageDropzone";
import { formatProjectApiError } from "../components/projectFormErrors";

const BlockNoteEditor = dynamic(
  () => import("@/components/BlockNoteEditor"),
  { ssr: false }
);

const EMPTY_DESCRIPTION_ERROR =
  "Описание проекта обязательно для заполнения. Пожалуйста, откройте текстовый блок и добавьте описание.";

const PUBLICATION_RULES_PDF = "/docs/ardi-pravila-publikacii-proektov.pdf";
const PROFILE_HREF = "/profile";

export default function CreateProjectPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [createProject] = useApiProjectsCreateCreateMutation();
  const user = useAppSelector((state) => state.authSlice.user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { images, addFiles, removeImage } = useUploadedImages();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeBlock, setActiveBlock] = useState<"image" | "text" | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Аккаунтам из админки и старых регистраций специальность не задана —
  // спрашиваем её здесь, профиль специалиста заведётся вместе с проектом.
  const needsSpecialty = user?.role === "specialist" && !user.specialistSlug;
  const [specialty, setSpecialty] = useState("");
  const isIncomplete =
    !title.trim() || images.length === 0 || (needsSpecialty && !specialty);

  const handleSubmit = async () => {
    if (!title.trim() || !user) return;

    setError(null);

    if (!stripHtml(description)) {
      setError(EMPTY_DESCRIPTION_ERROR);
      setActiveBlock("text");
      setShowPreview(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (needsSpecialty) formData.append("category", specialty);

      images.forEach((img) => {
        formData.append("images", img.file);
      });

      await createProject({
        // Файлы уходят multipart'ом, поэтому тело — FormData, а не JSON из схемы
        projectCreate: formData as unknown as ProjectCreateWrite,
      }).unwrap();
      // Первый проект компании заводит ей профиль-портфолио на бэкенде —
      // перезапрашиваем профиль, чтобы подтянуть его id и slug.
      dispatch(authApi.util.invalidateTags(["UserProfile"]));
      // В портфолио кабинета новый проект виден сразу, со статусом модерации.
      // Публичная страница зависит от специальности, а у компании её нет.
      router.push(PROFILE_HREF);
    } catch (err) {
      console.error("Ошибка создания проекта:", err);
      setError(formatProjectApiError(err, "Произошла ошибка при создании проекта"));
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
              src={user?.image || "/user.svg"}
              width={80}
              height={80}
              alt={user?.name || ""}
              className={`rounded-full w-20 h-20 ${user?.image ? 'object-cover' : 'object-none'}`}
            />
            <div>
              <h2 className="font-semibold text-lg">{user?.name}</h2>
              <p className="text-sm text-[#666666]">
                {user?.position || (user?.role === "company" ? "Компания" : "Специалист")}
              </p>
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
                <Image
                  src={img.preview}
                  alt={`${title} - ${index + 1}`}
                  width={1200}
                  height={800}
                  unoptimized
                  className="w-full h-auto object-cover"
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
              <div
                className="text-[#333333] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
              />
            </div>
          </div>
        )}

        <Separator className="mb-6" />

        {error && (
          <div className="max-w-md mx-auto text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-6 whitespace-pre-line">
            {error}
          </div>
        )}

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
          <Link href={PROFILE_HREF} className="hover:text-gray-700">
            Мой профиль
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Создать проект</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая часть — форма */}
        <div className="lg:col-span-2 space-y-6">
          {needsSpecialty && (
            <div>
              <label className="text-sm font-medium text-[#333] mb-2 block">
                Ваша специальность
              </label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите специальность" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-[#949494] mt-2">
                В вашем аккаунте специальность ещё не указана. Профиль в разделе
                «Специалисты» появится вместе с первым проектом.
              </p>
            </div>
          )}

          {/* Заголовок */}
          <div>
            <label className="text-sm font-medium text-[#333] mb-2 block">
              Название проекта
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Напишите название проекта"
              className="text-base"
            />
          </div>

          {/* Область загрузки изображений */}
          <ProjectImageDropzone
            images={images}
            onAddFiles={addFiles}
            onRemove={removeImage}
            inputRef={fileInputRef}
          />

          {/* Описание */}
          {activeBlock === "text" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#333] block">
                Описание проекта
              </label>
              <div className="border rounded-lg p-2 min-h-[200px] bg-white">
                <BlockNoteEditor onChange={(html) => setDescription(html)} />
              </div>
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
            {error && (
              <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3 whitespace-pre-line">
                {error}
              </div>
            )}
            <Button
              variant="outline"
              className="w-full rounded-[40px]"
              disabled={isIncomplete}
              onClick={() => {
                setError(null);
                if (!stripHtml(description)) {
                  setError(EMPTY_DESCRIPTION_ERROR);
                  setActiveBlock("text");
                  return;
                }
                setShowPreview(true);
              }}
            >
              Предварительный просмотр
            </Button>
            <Button
              className="w-full rounded-[40px]"
              onClick={handleSubmit}
              disabled={isIncomplete || isSubmitting}
            >
              {isSubmitting ? "Создание..." : "Продолжить"}
            </Button>
            <a
              href={PUBLICATION_RULES_PDF}
              download="ARDI — правила публикации проектов.pdf"
              className="flex items-center justify-center gap-2 pt-1 text-sm text-[#666] underline underline-offset-4 transition-colors hover:text-[#333]"
            >
              <FileDown className="w-4 h-4 shrink-0" aria-hidden="true" />
              Правила публикации проекта
              <span className="sr-only">(скачать PDF)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
