// app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      <div className="text-center py-12 max-w-md mx-auto">
        <h1 className="text-xl font-semibold mb-2">Страница не найдена</h1>
        <p className="text-[#666666] mb-6">
          Такой страницы нет или она была удалена.
        </p>
        <Link href="/">
          <Button className="rounded-[40px]">На главную</Button>
        </Link>
      </div>
    </section>
  );
}
