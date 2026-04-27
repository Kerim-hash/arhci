// components/ShareModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, ThumbsUp, Copy, Check, X } from "lucide-react";
import Image from "next/image";
import { Project } from "@/types/project";
import { Specialist } from "@/types/specialists";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  specialist: Specialist | null;
}

export default function ShareModal({
  isOpen,
  onClose,
  project,
  specialist,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareToSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(project.title);

    let shareUrl = "";
    switch (platform) {
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case "instagram":
        alert("Скопируйте ссылку и вставьте в Instagram");
        return;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[620px] p-0 overflow-hidden rounded-2xl">
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Картинка 620x400 */}
        <div className="relative w-full h-[400px] bg-gray-900">
          <img
            src={project.previewImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />

          {/* Затемнение снизу только для текста */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Информация о проекте поверх картинки внизу */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-end justify-between">
              {specialist && (
                <div className="flex items-center gap-2">
                  <Image
                    src={specialist.avatar}
                    width={32}
                    height={32}
                    alt={specialist.name}
                    className="rounded-full w-8 h-8 object-cover"
                  />
                  <div className="flex flex-col gap-[2px]">
                    <h3 className="font-semibold text-[16px]">
                      {project.title}
                    </h3>
                    <span className="text-sm text-white/80 truncate">
                      {specialist.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Статистика */}
              <div className="flex items-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{project.views || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{project.likes || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Социальные сети и кнопка копирования - вне картинки */}
        <div className="p-6 bg-white">
          <p className="text-sm text-[#666666] text-center mb-4">
            Поделиться через
          </p>

          <div className="flex justify-center gap-6 mb-6">
            {/* Telegram */}
            <button
              onClick={() => shareToSocial("telegram")}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-12 h-12  rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                <svg
                  width="20"
                  height="17"
                  viewBox="0 0 20 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.1638 0.5C18.7338 0.5 19.1638 1 18.9338 1.93L16.1438 15.08C15.9488 16.015 15.3838 16.24 14.6038 15.805L7.94882 10.89C7.92302 10.8715 7.90199 10.8471 7.88749 10.8188C7.87298 10.7906 7.86542 10.7593 7.86542 10.7275C7.86542 10.6957 7.87298 10.6644 7.88749 10.6362C7.90199 10.6079 7.92302 10.5835 7.94882 10.565L15.6338 3.625C15.9838 3.315 15.5588 3.165 15.0988 3.445L5.45382 9.53C5.42457 9.54908 5.39136 9.56124 5.35671 9.56557C5.32206 9.56991 5.28687 9.56629 5.25382 9.555L1.15882 8.26C0.248824 7.995 0.248824 7.37 1.36382 6.925L17.7488 0.605C17.8789 0.543161 18.0199 0.507486 18.1638 0.5Z"
                    stroke="#333333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <span className="text-xs text-[#666666]">Telegram</span>
            </button>

            {/* Facebook */}
            <button
              onClick={() => shareToSocial("facebook")}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_5177_3161)">
                    <path
                      d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z"
                      stroke="#333333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 22.9998V9.49983C11.9924 9.12488 12.0693 8.75302 12.2249 8.4118C12.3805 8.07059 12.6109 7.76875 12.899 7.52867C13.1871 7.28858 13.5256 7.11638 13.8893 7.02484C14.2529 6.9333 14.6326 6.92475 15 6.99983M10 12.9998H14.5"
                      stroke="#333333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_5177_3161">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <span className="text-xs text-[#666666]">Facebook</span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => shareToSocial("whatsapp")}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-12 h-12  flex items-center justify-center transition-transform group-hover:scale-110">
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#333333"
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                  />
                </svg>
              </div>
              <span className="text-xs text-[#666666]">WhatsApp</span>
            </button>
          </div>

          {/* Кнопка копировать ссылку */}
          <Button
            onClick={handleCopyLink}
            className="w-full gap-2"
            variant="outline"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Ссылка скопирована!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Копировать ссылку
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
