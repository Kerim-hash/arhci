// app/work/components/LoadMoreButton.tsx
"use client";

import { Button } from "@/components/ui/button";

interface LoadMoreButtonProps {
  hasMore: boolean;
  isLoading: boolean;
  onClick: () => void;
}

/** Кнопка «Показать ещё» под списком; скрыта, когда страниц больше нет. */
export function LoadMoreButton({ hasMore, isLoading, onClick }: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center pt-2">
      <Button
        variant="outline"
        className="rounded-[40px]"
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? "Загрузка..." : "Показать ещё"}
      </Button>
    </div>
  );
}
