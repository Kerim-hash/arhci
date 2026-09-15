"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Star, Undo2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, stripHtml } from "@/lib/utils";
import {
  useApiProjectsPartialUpdateMutation,
  type PatchedProjectUpdateWrite,
  type ProjectDetailRead,
} from "@/services/generatedApi";
import { ProjectImageDropzone, useUploadedImages } from "./ProjectImageDropzone";
import { formatProjectApiError } from "./projectFormErrors";

const BlockNoteEditor = dynamic(() => import("@/components/BlockNoteEditor"), {
  ssr: false,
});

interface EditProjectFormProps {
  project: ProjectDetailRead;
}

const iconButtonClass =
  "w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors";

export default function EditProjectForm({ project }: EditProjectFormProps) {
  const router = useRouter();
  const [updateProject, { isLoading: isSaving }] = useApiProjectsPartialUpdateMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [removedIds, setRemovedIds] = useState<number[]>([]);
  const [previewId, setPreviewId] = useState<number | null>(
    () => project.images.find((img) => img.isPreview)?.id ?? project.images[0]?.id ?? null,
  );
  const { images: newImages, addFiles, removeImage } = useUploadedImages();
  const [error, setError] = useState<string | null>(null);

  const keptImages = useMemo(
    () => project.images.filter((img) => !removedIds.includes(img.id)),
    [project.images, removedIds],
  );
  const hasImages = keptImages.length + newImages.length > 0;

  const markRemoved = (id: number) => {
    const nextRemoved = [...removedIds, id];
    setRemovedIds(nextRemoved);
    if (previewId === id) {
      const fallback = project.images.find((img) => !nextRemoved.includes(img.id));
      setPreviewId(fallback?.id ?? null);
    }
  };

  const restore = (id: number) => {
    setRemovedIds((prev) => prev.filter((removedId) => removedId !== id));
    if (previewId === null) setPreviewId(id);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!title.trim()) {
      setError("Укажите название проекта.");
      return;
    }
    if (!stripHtml(description)) {
      setError("Описание проекта не может быть пустым.");
      return;
    }
    if (!hasImages) {
      setError("Добавьте хотя бы одно изображение.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description);
    newImages.forEach((img) => formData.append("images", img.file));
    removedIds.forEach((id) => formData.append("remove_image_ids", String(id)));
    if (previewId !== null) {
      formData.append("preview_image_id", String(previewId));
    }

    try {
      await updateProject({
        id: project.id,
        // Файлы уходят multipart'ом, поэтому тело — FormData, а не JSON из схемы
        patchedProjectUpdate: formData as unknown as PatchedProjectUpdateWrite,
      }).unwrap();
      toast.success("Изменения сохранены. Проект отправлен на повторную модерацию.");
      router.push(`/projects/${project.id}`);
    } catch (err) {
      setError(formatProjectApiError(err, "Не удалось сохранить проект"));
    }
  };

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8 max-w-[900px]">
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
          <Link href={`/projects/${project.id}`} className="hover:text-gray-700">
            {project.title}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Редактирование</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label htmlFor="project-title" className="text-sm font-medium text-[#333] mb-2 block">
              Название проекта
            </label>
            <Input
              id="project-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Напишите название проекта"
              className="text-base"
            />
          </div>

          {project.images.length > 0 && (
            <div>
              <p className="text-sm font-medium text-[#333] mb-2">Загруженные изображения</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {project.images.map((img) => {
                  const isRemoved = removedIds.includes(img.id);
                  const isCover = previewId === img.id && !isRemoved;
                  return (
                    <div
                      key={img.id}
                      className={cn(
                        "relative group rounded-lg overflow-hidden aspect-video bg-gray-100",
                        isRemoved && "opacity-40",
                      )}
                    >
                      <Image
                        src={img.image}
                        alt={img.alt || project.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      {isCover && (
                        <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                          Обложка
                        </span>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        {isRemoved ? (
                          <button
                            type="button"
                            onClick={() => restore(img.id)}
                            title="Вернуть изображение"
                            aria-label="Вернуть изображение"
                            className={iconButtonClass}
                          >
                            <Undo2 className="w-3 h-3 text-white" />
                          </button>
                        ) : (
                          <>
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => setPreviewId(img.id)}
                                title="Сделать обложкой"
                                aria-label="Сделать обложкой"
                                className={iconButtonClass}
                              >
                                <Star className="w-3 h-3 text-white" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => markRemoved(img.id)}
                              title="Удалить изображение"
                              aria-label="Удалить изображение"
                              className={iconButtonClass}
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-[#949494] mt-2">
                Удаление применится после сохранения. Звёздочка делает изображение обложкой.
              </p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-[#333] mb-2">Новые изображения</p>
            <ProjectImageDropzone
              images={newImages}
              onAddFiles={addFiles}
              onRemove={removeImage}
              inputRef={fileInputRef}
              coverIndex={null}
              emptyHint="Перетащите новые изображения сюда или нажмите, чтобы загрузить"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-[#333]">Описание проекта</p>
            <div className="border rounded-lg p-2 min-h-[200px] bg-white">
              <BlockNoteEditor
                initialHTML={project.description}
                onChange={(html) => setDescription(html)}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="border border-[#E0E0E0] rounded-lg p-4 text-sm text-[#666]">
            После сохранения проект снова отправится на модерацию и станет виден
            остальным после проверки.
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3 whitespace-pre-line">
              {error}
            </div>
          )}

          <Button
            className="w-full rounded-[40px]"
            onClick={handleSubmit}
            disabled={!title.trim() || !hasImages || isSaving}
          >
            {isSaving ? "Сохранение..." : "Сохранить изменения"}
          </Button>
          <Link href={`/projects/${project.id}`} className="block">
            <Button type="button" variant="outline" className="w-full rounded-[40px]">
              Отмена
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
