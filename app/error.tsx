// app/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Граница ошибок для всего приложения: упавшая страница больше не
 * оставляет белый экран, а показывает понятное сообщение и кнопку повтора.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Ошибка рендера страницы:", error);
  }, [error]);

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      <div className="text-center py-12 max-w-md mx-auto">
        <h1 className="text-xl font-semibold mb-2">Что-то пошло не так</h1>
        <p className="text-[#666666] mb-6">
          Не удалось показать страницу. Попробуйте ещё раз или вернитесь на главную.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/">
            <Button variant="outline" className="rounded-[40px]">
              На главную
            </Button>
          </Link>
          <Button className="rounded-[40px]" onClick={() => reset()}>
            Повторить
          </Button>
        </div>
      </div>
    </section>
  );
}
