import Link from "next/link";
import { Plus } from "lucide-react";

/** Карточка «Создать проект» в сетке своих проектов — профиль специалиста и страница компании. */
export default function CreateProjectCard() {
  return (
    <Link href="/projects/create" className="block">
      <div className="border-2 border-dashed border-[#E0E0E0] rounded-lg flex flex-col items-center justify-center min-h-[200px] hover:border-[#333] transition-colors cursor-pointer">
        <div className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center mb-3">
          <Plus className="w-5 h-5 text-[#333]" />
        </div>
        <span className="text-sm text-[#333] font-medium">Создать проект</span>
      </div>
    </Link>
  );
}
