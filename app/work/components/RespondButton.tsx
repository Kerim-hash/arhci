// app/work/components/RespondButton.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RoleGuard } from "@/components/RoleGuard";
import { formatApiError } from "@/lib/formatApiError";
import { cn } from "@/lib/utils";

interface RespondButtonProps {
  /** Вызов мутации отклика; должен бросать ошибку RTK Query при неудаче. */
  onRespond: () => Promise<unknown>;
  className?: string;
  size?: React.ComponentProps<typeof Button>["size"];
}

/**
 * Кнопка «Откликнуться» для вакансий и заказов. Видна только специалисту;
 * после успешного отклика остаётся заблокированной, а текст ошибки
 * (например «Вы уже откликнулись») берётся из ответа бэкенда.
 */
export function RespondButton({ onRespond, className, size }: RespondButtonProps) {
  const [isResponding, setIsResponding] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);

  const handleRespond = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResponding(true);
    try {
      await onRespond();
      setHasResponded(true);
      toast.success("Отклик отправлен");
    } catch (error) {
      const status = (error as { status?: number } | null)?.status;
      if (status === 401) {
        toast.error("Авторизуйтесь, чтобы откликнуться");
      } else {
        toast.error(formatApiError(error, "Ошибка при отправке отклика"));
      }
    } finally {
      setIsResponding(false);
    }
  };

  const label = hasResponded
    ? "Отклик отправлен"
    : isResponding
      ? "Отправка..."
      : "Откликнуться";

  return (
    <RoleGuard role="specialist">
      <Button
        className={cn("rounded-[40px] whitespace-nowrap", className)}
        size={size}
        onClick={handleRespond}
        disabled={isResponding || hasResponded}
      >
        {label}
      </Button>
    </RoleGuard>
  );
}
