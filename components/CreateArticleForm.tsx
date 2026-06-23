// components/CreateArticleForm.tsx
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import axios, { AxiosError } from "axios";
import { useDropzone } from "react-dropzone";
import type { ApiError } from "../types/article.types";
import { Button } from "./ui/button";
import { tokenStorage } from "@/hooks/storage";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGetProfileQuery } from "@/app/store/features/authApi";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";

const DynamicRichTextBlock = dynamic(
  () => import("@/components/RichTextBlock"),
  { ssr: false, loading: () => <div className="border border-gray-200 rounded-md p-4 min-h-[120px] animate-pulse bg-gray-50" /> }
);

// ─── Block Types ───────────────────────────────────────────
type BlockType = "text" | "image" | "video" | "gallery";

interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  file?: File | null;
  previewUrl?: string | null;
  altText: string;
  files?: File[];
  previewUrls?: string[];
}

// ─── Panel views ───────────────────────────────────────────
type PanelView = "select" | "image" | "video" | "gallery" | "edit-image" | "edit-video" | "edit-gallery";

// ─── Icons ─────────────────────────────────────────────────
const TextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7V4h16v3" />
    <path d="M9 20h6" />
    <path d="M12 4v16" />
  </svg>
);

const ImageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

const VideoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <path d="M10 8l6 4-6 4V8z" />
  </svg>
);

const GalleryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="17,8 12,3 7,8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,6 5,6 21,6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5" />
    <path d="M5 12l7-7 7 7" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14" />
    <path d="M19 12l-7 7-7-7" />
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const ImagePlaceholderIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

// ─── Generate ID ───────────────────────────────────────────
const generateId = () => Math.random().toString(36).substring(2, 10);

// ═══════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════

const CreateArticleForm: React.FC = () => {
  const router = useRouter();
  const { data: user } = useGetProfileQuery();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formState, setFormState] = useState<"editing" | "success">("editing");
  const [isSticky, setIsSticky] = useState(false);
  const [zoomImages, setZoomImages] = useState<string[]>([]);
  const [zoomIndex, setZoomIndex] = useState<number>(-1);

  useEffect(() => {
    if (zoomIndex === -1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setZoomIndex(prev => (prev < zoomImages.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowLeft") {
        setZoomIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Escape") {
        setZoomIndex(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomIndex, zoomImages.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Form state
  const [title, setTitle] = useState("");
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [biography, setBiography] = useState("");
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [docxFile, setDocxFile] = useState<File | null>(null);

  // Panel state
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelView, setPanelView] = useState<PanelView>("select");
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  // Temp state for panel forms
  const [tempVideoUrl, setTempVideoUrl] = useState("");
  const [tempAltText, setTempAltText] = useState("");
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [tempFileUrl, setTempFileUrl] = useState<string | null>(null);
  const [tempGalleryFiles, setTempGalleryFiles] = useState<File[]>([]);
  const [tempGalleryUrls, setTempGalleryUrls] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Derived state
  const hasDocx = docxFile !== null;
  const hasBlocks = blocks.length > 0;

  // ─── Preview image dropzone ──────────────────────────────
  const onDropPreview = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (previewImageUrl) URL.revokeObjectURL(previewImageUrl);
      setPreviewImage(file);
      setPreviewImageUrl(URL.createObjectURL(file));
      setError("");
    }
  }, [previewImageUrl]);

  const {
    getRootProps: getRootPropsPreview,
    getInputProps: getInputPropsPreview,
    isDragActive: isDragActivePreview,
  } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] },
    maxFiles: 1,
    onDrop: onDropPreview,
  });

  // ─── DOCX dropzone ──────────────────────────────────────
  const onDropDocx = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setDocxFile(acceptedFiles[0]);
      setError("");
    }
  }, []);

  const {
    getRootProps: getRootPropsDocx,
    getInputProps: getInputPropsDocx,
    isDragActive: isDragActiveDocx,
  } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    onDrop: onDropDocx,
  });

  // ─── Block management ────────────────────────────────────
  const openAddPanel = () => {
    setEditingBlockId(null);
    setPanelView("select");
    clearTempState();
    setIsPanelOpen(true);
  };

  // Clear temp state WITHOUT revoking URLs (for after save)
  const clearTempState = () => {
    setTempVideoUrl("");
    setTempAltText("");
    setTempFile(null);
    setTempFileUrl(null);
    setTempGalleryFiles([]);
    setTempGalleryUrls([]);
  };

  // Cancel temp state WITH revoking URLs (for cancel/dismiss)
  const cancelTempState = () => {
    setTempVideoUrl("");
    setTempAltText("");
    setTempFile(null);
    if (tempFileUrl) URL.revokeObjectURL(tempFileUrl);
    setTempFileUrl(null);
    tempGalleryUrls.forEach((u) => URL.revokeObjectURL(u));
    setTempGalleryFiles([]);
    setTempGalleryUrls([]);
  };

  const addTextBlock = () => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type: "text",
      content: "",
      altText: "",
    };
    setBlocks((prev) => [...prev, newBlock]);
    setIsPanelOpen(false);
  };

  const selectBlockType = (type: BlockType) => {
    if (type === "text") {
      addTextBlock();
      return;
    }
    clearTempState();
    setPanelView(type);
  };

  // Handle panel image file select
  const handlePanelFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (tempFileUrl) URL.revokeObjectURL(tempFileUrl);
      setTempFile(file);
      setTempFileUrl(URL.createObjectURL(file));
    }
  };

  // Handle panel gallery files select
  const handleGalleryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setTempGalleryFiles((prev) => [...prev, ...files]);
      setTempGalleryUrls((prev) => [
        ...prev,
        ...files.map((f) => URL.createObjectURL(f)),
      ]);
    }
  };

  // Save image block
  const saveImageBlock = () => {
    if (!tempFile || !tempFileUrl) return;

    if (editingBlockId) {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === editingBlockId
            ? { ...b, file: tempFile, previewUrl: tempFileUrl, altText: tempAltText }
            : b
        )
      );
    } else {
      const newBlock: ContentBlock = {
        id: generateId(),
        type: "image",
        content: "",
        file: tempFile,
        previewUrl: tempFileUrl,
        altText: tempAltText,
      };
      setBlocks((prev) => [...prev, newBlock]);
    }
    setIsPanelOpen(false);
    clearTempState(); // Don't revoke — URLs now belong to blocks
  };

  // Save video block
  const saveVideoBlock = () => {
    if (!tempVideoUrl) return;

    if (editingBlockId) {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === editingBlockId
            ? { ...b, content: tempVideoUrl, altText: tempAltText }
            : b
        )
      );
    } else {
      const newBlock: ContentBlock = {
        id: generateId(),
        type: "video",
        content: tempVideoUrl,
        altText: tempAltText,
      };
      setBlocks((prev) => [...prev, newBlock]);
    }
    setIsPanelOpen(false);
    clearTempState();
  };

  // Save gallery block
  const saveGalleryBlock = () => {
    if (tempGalleryFiles.length === 0) return;

    if (editingBlockId) {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === editingBlockId
            ? {
                ...b,
                files: [...tempGalleryFiles],
                previewUrls: [...tempGalleryUrls],
                altText: tempAltText,
              }
            : b
        )
      );
    } else {
      const newBlock: ContentBlock = {
        id: generateId(),
        type: "gallery",
        content: "",
        altText: tempAltText,
        files: [...tempGalleryFiles],
        previewUrls: [...tempGalleryUrls],
      };
      setBlocks((prev) => [...prev, newBlock]);
    }
    setIsPanelOpen(false);
    clearTempState(); // Don't revoke — URLs now belong to blocks
  };

  // Edit a block
  const editBlock = (block: ContentBlock) => {
    setEditingBlockId(block.id);
    clearTempState();

    if (block.type === "image") {
      setTempFile(block.file || null);
      setTempFileUrl(block.previewUrl || null);
      setTempAltText(block.altText || "");
      setPanelView("edit-image");
    } else if (block.type === "video") {
      setTempVideoUrl(block.content || "");
      setTempAltText(block.altText || "");
      setPanelView("edit-video");
    } else if (block.type === "gallery") {
      setTempGalleryFiles(block.files ? [...block.files] : []);
      setTempGalleryUrls(block.previewUrls ? [...block.previewUrls] : []);
      setTempAltText(block.altText || "");
      setPanelView("edit-gallery");
    }
    setIsPanelOpen(true);
  };

  // Delete a block
  const deleteBlock = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId);
    if (block) {
      if (block.previewUrl) URL.revokeObjectURL(block.previewUrl);
      block.previewUrls?.forEach((u) => URL.revokeObjectURL(u));
    }
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
  };

  // Move block up/down
  const moveBlock = (blockId: string, direction: "up" | "down") => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === blockId);
      if (idx === -1) return prev;
      if (direction === "up" && idx === 0) return prev;
      if (direction === "down" && idx === prev.length - 1) return prev;
      const newBlocks = [...prev];
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      [newBlocks[idx], newBlocks[swapIdx]] = [newBlocks[swapIdx], newBlocks[idx]];
      return newBlocks;
    });
  };

  // Duplicate block
  const duplicateBlock = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block) return;
    const newBlock: ContentBlock = {
      ...block,
      id: generateId(),
      // Re-create object URLs for duplicated files
      previewUrl: block.file ? URL.createObjectURL(block.file) : block.previewUrl,
      previewUrls: block.files?.map((f) => URL.createObjectURL(f)),
    };
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === blockId);
      const newBlocks = [...prev];
      newBlocks.splice(idx + 1, 0, newBlock);
      return newBlocks;
    });
  };

  // Update text block content
  const updateTextBlockContent = (blockId: string, content: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, content } : b))
    );
  };

  // ─── YouTube embed helper ───────────────────────────────
  const getYoutubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  // ─── Remove preview image ──────────────────────────────
  const removePreviewImage = () => {
    if (previewImageUrl) URL.revokeObjectURL(previewImageUrl);
    setPreviewImage(null);
    setPreviewImageUrl(null);
  };

  // ─── Remove DOCX ───────────────────────────────────────
  const removeDocx = () => {
    setDocxFile(null);
  };

  // ─── Submit ─────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Пожалуйста, введите заголовок статьи");
      return;
    }

    if (!hasDocx && !hasBlocks) {
      setError("Пожалуйста, добавьте контент: загрузите DOCX или добавьте блоки");
      return;
    }

    setLoading(true);
    setError("");

    const submitData = new FormData();
    submitData.append("title", title);
    submitData.append("is_published", "true");
    submitData.append("content_mode", hasDocx ? "docx" : "editor");

    if (previewImage) {
      submitData.append("preview_image", previewImage);
    }

    if (biography) {
      submitData.append("biography", biography);
    }

    if (hasDocx && docxFile) {
      submitData.append("word_file", docxFile);
    }

    if (!hasDocx) {
      // Serialize blocks as JSON
      const blocksData = blocks.map((b) => ({
        type: b.type,
        content: b.content,
        altText: b.altText,
      }));
      submitData.append("blocks", JSON.stringify(blocksData));

      // Append block files
      blocks.forEach((block, idx) => {
        if (block.type === "image" && block.file) {
          submitData.append(`block_file_${idx}`, block.file);
        }
        if (block.type === "gallery" && block.files) {
          block.files.forEach((f, fIdx) => {
            submitData.append(`block_gallery_${idx}_${fIdx}`, f);
          });
        }
      });
    }

    try {
      const token = tokenStorage.getAccessToken();
      const headers: Record<string, string> = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL || "https://api.ardi.kg"}/api/articles/create/`,
        submitData,
        { headers }
      );

      setFormState("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      setError(
        "Ошибка при создании статьи: " +
          (axiosErr.response?.data?.message || axiosErr.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // Success screen
  // ═══════════════════════════════════════════════════════════
  if (formState === "success") {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
          Написать как:
          <Image
            src={user?.image || "/user.svg"}
            width={24}
            height={24}
            alt="avatar"
            className="rounded-full object-cover"
          />
          {user?.email || "Daniar Asanov"}
        </div>

        <h1 className="text-3xl font-bold text-[#333] mb-4">
          Спасибо за написание статьи
        </h1>

        <p className="text-sm text-[#333] mb-4">
          Проверка займет около 3 дней
        </p>

        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          Мы внимательно изучим вашу публикацию в течение трех рабочих дней.
          Если возникнут вопросы, мы пришлем письмо с подробностями.
          Успешно одобренные публикации сразу появятся в вашем профиле.
        </p>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="px-5 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-[#333]"
        >
          Вернуться
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // Panel content renderers
  // ═══════════════════════════════════════════════════════════

  const renderPanelSelectView = () => (
    <div className="space-y-1">
      <button type="button" onClick={() => selectBlockType("text")}
        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
        <span className="text-gray-500"><TextIcon /></span>
        <span className="text-sm text-[#333]">Текст</span>
      </button>
      <button type="button" onClick={() => selectBlockType("image")}
        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
        <span className="text-gray-500"><ImageIcon /></span>
        <span className="text-sm text-[#333]">Картинка</span>
      </button>
      <button type="button" onClick={() => selectBlockType("video")}
        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
        <span className="text-gray-500"><VideoIcon /></span>
        <span className="text-sm text-[#333]">Видео</span>
      </button>
      <button type="button" onClick={() => selectBlockType("gallery")}
        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
        <span className="text-gray-500"><GalleryIcon /></span>
        <span className="text-sm text-[#333]">Галерея</span>
      </button>
    </div>
  );

  const renderPanelImageView = () => (
    <div className="space-y-5">
      {tempFileUrl ? (
        <div className="space-y-3">
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <img src={tempFileUrl} alt="Preview" className="w-full h-48 object-cover" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Изменить
            </button>
            <button type="button"
              onClick={() => {
                if (tempFileUrl && !editingBlockId) URL.revokeObjectURL(tempFileUrl);
                setTempFile(null);
                setTempFileUrl(null);
              }}
              className="flex-1 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Удалить
            </button>
          </div>
        </div>
      ) : (
        <div onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors">
          <p className="text-sm text-gray-500 mb-3">
            Перетащите файлы сюда или<br />нажмите кнопку &quot;Загрузить&quot;
          </p>
          <button type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <UploadIcon />
            Загрузить
          </button>
        </div>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePanelFileSelect} className="hidden" />
      <div>
        <label className="block text-sm text-[#333] mb-1.5">Альтернативный текст</label>
        <input type="text" value={tempAltText} onChange={(e) => setTempAltText(e.target.value)}
          placeholder="Введите альтернативный текст"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400" />
      </div>
      {tempFileUrl && (
        <Button type="button" onClick={saveImageBlock} variant="outline" className="w-full" size="sm">
          {editingBlockId ? "Сохранить" : "Добавить"}
        </Button>
      )}
    </div>
  );

  const renderPanelVideoView = () => (
    <div className="space-y-5">
      <div>
        <input type="url" value={tempVideoUrl} onChange={(e) => setTempVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 text-blue-600 underline" />
      </div>
      {getYoutubeEmbedUrl(tempVideoUrl) && (
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <iframe src={getYoutubeEmbedUrl(tempVideoUrl)!} className="w-full aspect-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen title="YouTube видео" />
        </div>
      )}
      <button type="button"
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
        <UploadIcon /> Загрузить
      </button>
      <div>
        <label className="block text-sm text-[#333] mb-1.5">Альтернативный текст</label>
        <input type="text" value={tempAltText} onChange={(e) => setTempAltText(e.target.value)}
          placeholder="Введите текст"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400" />
      </div>
      {tempVideoUrl && (
        <Button type="button" onClick={saveVideoBlock} variant="outline" className="w-full" size="sm">
          {editingBlockId ? "Сохранить" : "Добавить"}
        </Button>
      )}
    </div>
  );

  const renderPanelGalleryView = () => (
    <div className="space-y-5">
      {tempGalleryUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {tempGalleryUrls.map((url, idx) => (
            <div key={idx} className="relative rounded-lg overflow-hidden border border-gray-200 group/gal">
              <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-24 object-cover" />
              <button type="button"
                onClick={() => {
                  URL.revokeObjectURL(url);
                  setTempGalleryUrls((prev) => prev.filter((_, i) => i !== idx));
                  setTempGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
                }}
                className="absolute top-1 right-1 bg-white/90 rounded-full p-1 opacity-0 group-hover/gal:opacity-100 transition-opacity">
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      )}
      <div onClick={() => galleryInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors">
        <button type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <UploadIcon /> Загрузить фото
        </button>
      </div>
      <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryFileSelect} className="hidden" />
      <div>
        <label className="block text-sm text-[#333] mb-1.5">Альтернативный текст</label>
        <input type="text" value={tempAltText} onChange={(e) => setTempAltText(e.target.value)}
          placeholder="Введите альтернативный текст"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400" />
      </div>
      {tempGalleryFiles.length > 0 && (
        <Button type="button" onClick={saveGalleryBlock} variant="outline" className="w-full" size="sm">
          {editingBlockId ? "Сохранить" : "Добавить"}
        </Button>
      )}
    </div>
  );

  const getPanelTitle = (): string => {
    switch (panelView) {
      case "select": return "Добавить блок";
      case "image": case "edit-image": return "Картинка";
      case "video": case "edit-video": return "Видео";
      case "gallery": case "edit-gallery": return "Галерея";
      default: return "Добавить блок";
    }
  };

  const canGoBackInPanel = panelView !== "select";

  // ═══════════════════════════════════════════════════════════
  // Block toolbar
  // ═══════════════════════════════════════════════════════════
  const renderBlockToolbar = (block: ContentBlock, index: number) => (
    <div className="flex items-center justify-center gap-1 mt-2">
      <button type="button" onClick={() => moveBlock(block.id, "up")} disabled={index === 0}
        className="p-1.5 text-gray-400 hover:text-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded hover:bg-gray-100"
        aria-label="Переместить вверх">
        <ArrowUpIcon />
      </button>
      <button type="button" onClick={() => moveBlock(block.id, "down")} disabled={index === blocks.length - 1}
        className="p-1.5 text-gray-400 hover:text-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded hover:bg-gray-100"
        aria-label="Переместить вниз">
        <ArrowDownIcon />
      </button>
      <button type="button" onClick={() => duplicateBlock(block.id)}
        className="p-1.5 text-gray-400 hover:text-[#333] transition-colors rounded hover:bg-gray-100"
        aria-label="Дублировать">
        <CopyIcon />
      </button>
      <button type="button" onClick={() => deleteBlock(block.id)}
        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-red-50"
        aria-label="Удалить">
        <TrashIcon />
      </button>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // Render blocks
  // ═══════════════════════════════════════════════════════════
  const renderBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case "text":
        return (
          <div key={block.id}>
            <DynamicRichTextBlock
              onChange={(html) => updateTextBlockContent(block.id, html)}
            />
            {renderBlockToolbar(block, index)}
          </div>
        );

      case "image":
        return (
          <div key={block.id}>
            {block.previewUrl && (
              <div className="rounded-lg overflow-hidden cursor-zoom-in">
                <img
                  src={block.previewUrl}
                  alt={block.altText || "Image"}
                  className="w-full h-auto max-h-[400px] object-cover hover:scale-[1.01] transition-transform duration-200"
                  onClick={() => {
                    if (block.previewUrl) {
                      setZoomImages([block.previewUrl]);
                      setZoomIndex(0);
                    }
                  }}
                />
              </div>
            )}
            {block.altText && (
              <p className="text-xs text-gray-400 mt-1 italic">{block.altText}</p>
            )}
            {renderBlockToolbar(block, index)}
          </div>
        );

      case "video":
        return (
          <div key={block.id}>
            {getYoutubeEmbedUrl(block.content) ? (
              <div className="rounded-lg overflow-hidden">
                <iframe
                  src={getYoutubeEmbedUrl(block.content)!}
                  className="w-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={block.altText || "Video"}
                />
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <a href={block.content} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline break-all">
                  {block.content}
                </a>
              </div>
            )}
            {block.altText && (
              <p className="text-xs text-gray-400 mt-1 italic">{block.altText}</p>
            )}
            {renderBlockToolbar(block, index)}
          </div>
        );

      case "gallery":
        return (
          <div key={block.id}>
            {block.previewUrls && block.previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {block.previewUrls.map((url, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden border border-gray-100 cursor-zoom-in">
                    <img
                      src={url}
                      alt={`${block.altText || "Gallery"} ${idx + 1}`}
                      className="w-full h-32 object-cover hover:scale-105 transition-transform duration-200"
                      onClick={() => {
                        if (block.previewUrls) {
                          setZoomImages(block.previewUrls);
                          setZoomIndex(idx);
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            {block.altText && (
              <p className="text-xs text-gray-400 mt-1 italic">{block.altText}</p>
            )}
            {renderBlockToolbar(block, index)}
          </div>
        );

      default:
        return null;
    }
  };

  // ═══════════════════════════════════════════════════════════
  // Main render
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="w-full pb-12">
      {/* ─── Top bar: Назад / Далее (sticky full width wrapper) ─── */}
      <div className={`sticky top-[92px] md:top-[110px] z-30 w-full transition-all duration-200 ${
        isSticky
          ? "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs"
          : "bg-transparent"
      }`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between py-3 px-4 md:px-0">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-1.5 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-[#333] cursor-pointer"
          >
            Назад
          </button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            size="sm"
            className="px-6 cursor-pointer"
          >
            {loading ? "Отправка..." : "Далее"}
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-0 mt-8">
        {/* Alerts */}
      {error && (
        <div className="mb-5 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm" role="alert">
          {error}
        </div>
      )}

      {/* ─── Form ─── */}
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="article-title" className="block text-xs text-[#333] mb-1.5">
            Заголовок статьи
          </label>
          <input
            type="text"
            id="article-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-[3px] focus:outline-none focus:border-gray-500"
            placeholder="MODULE - Мастер-план городского будущего"
            disabled={loading}
          />
        </div>

        {/* Preview image */}
        {previewImageUrl ? (
          <div className="group relative">
            <div className="rounded-lg overflow-hidden">
              <img
                src={previewImageUrl}
                alt="Preview"
                className="w-full h-auto max-h-[400px] object-cover"
              />
            </div>
            <button
              type="button"
              onClick={removePreviewImage}
              className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-md shadow-sm hover:bg-white text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Удалить изображение"
            >
              <TrashIcon />
            </button>
          </div>
        ) : (
          <div
            {...getRootPropsPreview()}
            className={`border-2 border-dashed rounded-lg py-12 px-8 text-center cursor-pointer transition-colors
              ${isDragActivePreview ? "border-gray-500 bg-gray-50" : "border-gray-300 hover:border-gray-400"}
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input {...getInputPropsPreview()} disabled={loading} />
            <p className="text-sm text-gray-400 mb-4">
              {isDragActivePreview ? "Перетащите сюда" : "Перетащите изображения сюда или нажмите, чтобы загрузить"}
            </p>
            <div className="flex justify-center mb-4">
              <ImagePlaceholderIcon />
            </div>
            <button type="button"
              className="px-5 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-[#333]">
              Загрузить
            </button>
          </div>
        )}

        {/* ─── Content blocks (only when no DOCX) ─── */}
        {!hasDocx && blocks.length > 0 && (
          <div className="space-y-5">
            {blocks.map((block, index) => renderBlock(block, index))}
          </div>
        )}

        {/* ─── DOCX upload (hidden when blocks exist) ─── */}
        {!hasBlocks && (
          <div>
            {docxFile ? (
              <div className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#333]">{docxFile.name}</p>
                      <p className="text-xs text-gray-500">{(docxFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button type="button" onClick={removeDocx}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1" aria-label="Удалить файл">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div
                {...getRootPropsDocx()}
                className={`border-2 border-dashed rounded-lg py-8 px-8 text-center cursor-pointer transition-colors
                  ${isDragActiveDocx ? "border-gray-500 bg-gray-50" : "border-gray-300 hover:border-gray-400"}
                  ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input {...getInputPropsDocx()} disabled={loading} />
                <p className="text-sm text-gray-400 mb-4">
                  {isDragActiveDocx ? "Перетащите DOCX файл сюда" : "Перетащите файлы сюда или нажмите, чтобы загрузить"}
                </p>
                <button type="button"
                  className="px-5 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-[#333]">
                  Загрузить Word документ
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── Add block button (hidden when DOCX uploaded) ─── */}
        {!hasDocx && (
          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-gray-200" />
            <button
              type="button"
              onClick={openAddPanel}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs text-gray-500 hover:text-[#333] transition-colors whitespace-nowrap"
            >
              <PlusIcon />
              Добавить блок
            </button>
            <div className="flex-1 border-t border-gray-200" />
          </div>
        )}

        {/* Biography */}
        <div>
          <label htmlFor="biography" className="block text-xs text-[#333] mb-1.5">
            Биография
          </label>
          <textarea
            id="biography"
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-[3px] focus:outline-none focus:border-gray-500 resize-none min-h-[100px]"
            placeholder="Enter text"
            disabled={loading}
            rows={4}
          />
        </div>
      </div>
      </div>

      {/* ═══ Side Panel (Sheet) ═══════════════════════════════ */}
      <Sheet open={isPanelOpen} onOpenChange={(open) => {
        if (!open) cancelTempState();
        setIsPanelOpen(open);
      }}>
        <SheetContent side="right" className="w-[320px] sm:w-[360px] p-0 overflow-y-auto">
          {/* Panel header */}
          <div className="sticky top-0 bg-white z-10 px-5 pt-5 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {canGoBackInPanel && (
                <button
                  type="button"
                  onClick={() => {
                    if (editingBlockId) {
                      setIsPanelOpen(false);
                    } else {
                      setPanelView("select");
                    }
                    cancelTempState();
                  }}
                  className="text-gray-500 hover:text-[#333] transition-colors -ml-1"
                >
                  <ChevronLeft />
                </button>
              )}
              <SheetTitle className="text-base font-medium text-[#333]">
                {getPanelTitle()}
              </SheetTitle>
            </div>
            <SheetDescription className="sr-only">
              Выберите тип блока для добавления в статью
            </SheetDescription>
          </div>

          {/* Panel body */}
          <div className="px-5 py-5">
            {panelView === "select" && renderPanelSelectView()}
            {(panelView === "image" || panelView === "edit-image") && renderPanelImageView()}
            {(panelView === "video" || panelView === "edit-video") && renderPanelVideoView()}
            {(panelView === "gallery" || panelView === "edit-gallery") && renderPanelGalleryView()}
          </div>
        </SheetContent>
      </Sheet>

      {zoomIndex >= 0 && zoomImages.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
          onClick={() => setZoomIndex(-1)}
        >
          <button 
            type="button" 
            className="absolute top-4 right-4 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors cursor-pointer z-55"
            onClick={(e) => {
              e.stopPropagation();
              setZoomIndex(-1);
            }}
            aria-label="Закрыть"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {zoomIndex > 0 && (
            <button
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors cursor-pointer z-55"
              onClick={(e) => {
                e.stopPropagation();
                setZoomIndex(prev => prev - 1);
              }}
              aria-label="Предыдущее"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
          )}

          {zoomIndex < zoomImages.length - 1 && (
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors cursor-pointer z-55"
              onClick={(e) => {
                e.stopPropagation();
                setZoomIndex(prev => prev + 1);
              }}
              aria-label="Следующее"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          )}

          <div 
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={zoomImages[zoomIndex]} 
              alt={`Zoomed image ${zoomIndex + 1}`} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-300 animate-in zoom-in-95 duration-200"
              key={zoomIndex}
            />
            {zoomImages.length > 1 && (
              <span className="text-white/60 text-xs px-3 py-1 bg-white/10 rounded-full backdrop-blur-xs">
                {zoomIndex + 1} / {zoomImages.length}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateArticleForm;
