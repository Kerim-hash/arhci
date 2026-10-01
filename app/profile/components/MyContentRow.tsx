"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ModerationStatusBadge, ModerationStatus } from "@/components/ModerationStatusBadge";

interface MyContentRowProps {
  title: string;
  createdAt: string;
  status: ModerationStatus;
  onDelete: () => Promise<void> | void;
  /** Страница редактирования; без неё кнопка «Редактировать» остаётся выключенной. */
  editHref?: string;
  /** Публичная страница материала — заголовок становится ссылкой. */
  href?: string;
  /** Причина отклонения модератором; показывается только для статуса rejected. */
  moderationComment?: string;
  /** Дополнительные действия справа от статуса (например, ссылка на отклики). */
  extra?: ReactNode;
}

export function MyContentRow({
  title,
  createdAt,
  status,
  onDelete,
  editHref,
  href,
  moderationComment,
  extra,
}: MyContentRowProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = new Date(createdAt).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-gray-100 last:border-b-0">
      <div className="min-w-0">
        {href ? (
          <Link href={href} className="font-medium text-[#333] truncate block hover:underline">
            {title}
          </Link>
        ) : (
          <p className="font-medium text-[#333] truncate">{title}</p>
        )}
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="text-sm text-gray-500">{formattedDate}</span>
          <ModerationStatusBadge status={status} />
          {extra}
        </div>
        {status === "rejected" && moderationComment && (
          <p className="text-xs text-red-600 mt-1.5">Причина: {moderationComment}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          disabled={!editHref}
          title={editHref ? undefined : "Редактирование скоро будет доступно"}
          onClick={() => editHref && router.push(editHref)}
          className="gap-1.5"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Редактировать</span>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 text-red-500 hover:text-red-600">
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Удалить</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить публикацию?</AlertDialogTitle>
              <AlertDialogDescription>
                «{title}» будет удалена без возможности восстановления.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600"
              >
                {isDeleting ? "Удаление..." : "Удалить"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
