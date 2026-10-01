import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";

import { ModerationStatusBadge } from "@/components/ModerationStatusBadge";
import { Card } from "@/components/ui/card";
import { formatLongDate } from "@/lib/formatDate";
import { stripHtml } from "@/lib/utils";
import type { ModerationStatusEnum } from "@/services/generatedApi";

export interface Publication {
  id: number;
  title: string;
  slug?: string;
  previewImage?: string | null;
  shortDescription?: string;
  views?: number;
  createdAt: string;
  /** Есть только у статей: неодобренные API отдаёт автору и сотрудникам. */
  moderationStatus?: ModerationStatusEnum;
}

interface PublicationGridProps {
  items: Publication[];
  /** Раздел сайта: `/articles` или `/news`. */
  basePath: string;
  showViews?: boolean;
}

/** Сетка карточек статей и новостей — у них одна разметка. */
export function PublicationGrid({ items, basePath, showViews = false }: PublicationGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {items.map((item, index) => {
        const href = `${basePath}/${item.slug}`;
        const isUnderModeration =
          item.moderationStatus !== undefined && item.moderationStatus !== "approved";

        return (
          <Card key={item.id} className="overflow-hidden flex flex-col p-0 gap-0">
            <Link
              href={href}
              className="relative block aspect-video md:aspect-[2/5] overflow-hidden md:max-h-[320px] w-full bg-gray-100 group"
            >
              {item.previewImage ? (
                <Image
                  src={item.previewImage}
                  alt={item.title}
                  fill
                  className="object-cover w-full transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  // Первый ряд виден сразу — его картинки не откладываем
                  priority={index < 2}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">Нет изображения</span>
                </div>
              )}
              {isUnderModeration && item.moderationStatus && (
                <div className="absolute top-3 left-3">
                  <ModerationStatusBadge status={item.moderationStatus} />
                </div>
              )}
            </Link>

            <div className="p-4 md:p-6 flex-1">
              <h2 className="text-lg sm:text-xl md:text-[32px] font-medium leading-tight mb-3 line-clamp-2">
                <Link href={href} className="hover:text-blue-600 hover:underline transition-colors">
                  {item.title}
                </Link>
              </h2>

              <p className="text-sm md:text-[16px] text-[#6D6D6D] leading-relaxed line-clamp-3 md:line-clamp-4 mb-4">
                {stripHtml(item.shortDescription || "") || "Описание отсутствует"}
              </p>

              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-xs text-gray-400">{formatLongDate(item.createdAt)}</p>
                {showViews && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{item.views || 0}</span>
                  </div>
                )}
              </div>
            </div>

            <Link
              href={href}
              className="block text-right px-4 md:px-6 pb-4 md:pb-6 font-medium text-[18px] text-blue-600 hover:text-blue-800 transition-colors"
            >
              Читать далее →
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
