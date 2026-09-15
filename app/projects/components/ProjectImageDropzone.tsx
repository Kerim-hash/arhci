"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type RefObject,
} from "react";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

/** Ещё не отправленные на сервер картинки с object-URL превью. */
export function useUploadedImages() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  // Актуальный список нужен только cleanup-эффекту при размонтировании,
  // поэтому держим его в ref и обновляем вне рендера.
  const latest = useRef<UploadedImage[]>([]);
  useEffect(() => {
    latest.current = images;
  }, [images]);

  // Освобождаем object-URL при размонтировании формы
  useEffect(
    () => () => {
      latest.current.forEach((img) => URL.revokeObjectURL(img.preview));
    },
    [],
  );

  const addFiles = useCallback((files: FileList | File[] | null) => {
    if (!files) return;
    const next = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
      }));
    if (next.length > 0) {
      setImages((prev) => [...prev, ...next]);
    }
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  return { images, addFiles, removeImage };
}

interface ProjectImageDropzoneProps {
  images: UploadedImage[];
  onAddFiles: (files: FileList | null) => void;
  onRemove: (id: string) => void;
  /** Скрытый input живёт здесь, но ref отдаём наружу — родитель тоже может открыть выбор файлов. */
  inputRef: RefObject<HTMLInputElement | null>;
  /** Индекс картинки, подписанной как «Обложка»; null — не подписывать. */
  coverIndex?: number | null;
  emptyHint?: string;
  addLabel?: string;
}

export function ProjectImageDropzone({
  images,
  onAddFiles,
  onRemove,
  inputRef,
  coverIndex = 0,
  emptyHint = "Перетащите изображения сюда или нажмите, чтобы загрузить",
  addLabel = "Добавить ещё",
}: ProjectImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    onAddFiles(e.dataTransfer.files);
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    onAddFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? "border-[#333] bg-gray-50" : "border-[#E0E0E0] bg-white"
      }`}
    >
      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-[#949494] mb-6">{emptyHint}</p>
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
            <ImageIcon className="w-8 h-8 text-[#949494]" />
          </div>
          <Button type="button" variant="outline" className="rounded-[40px]" onClick={openPicker}>
            Загрузить
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img, index) => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-video">
                <Image
                  src={img.preview}
                  alt={`Uploaded ${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
                {coverIndex === index && (
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                    Обложка
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(img.id)}
                  aria-label="Убрать изображение"
                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" className="rounded-[40px]" onClick={openPicker}>
            {addLabel}
          </Button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleInput}
      />
    </div>
  );
}
