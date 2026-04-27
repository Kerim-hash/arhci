// components/SpecialistCard.tsx
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Specialist } from "@/types/specialists";
import { Eye, ThumbsUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SpecialistCardProps {
  specialist: Specialist;
  simplified?: boolean; // Упрощенная версия без оценок и просмотров
}

export default function SpecialistCard({
  specialist,
  simplified = false,
}: SpecialistCardProps) {
  return (
    <Link
      href={`/specialists/${specialist.category}/${specialist.slug}`}
      className="flex flex-col rounded-lg hover:bg-gray-50 transition-colors"
    >
      <Card className="text-center gap-6">
        <div className="rounded-full mx-auto w-[40px] h-[40px] md:w-[60px] md:h-[60px] lg:w-[80px] lg:h-[80px] overflow-hidden border-4 border-white">
          <Image
            src={specialist.avatar}
            width={80}
            height={80}
            alt={specialist.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="min-w-0">
            <h3 className="text-[18px] sm:text-[19px] lg:text-[24px] font-semibold leading-tight truncate">
              {specialist.name}
            </h3>
          </div>
          <p className="text-[#666666] text-sm sm:text-[15px] lg:text-[14px] leading-tight mt-1">
            {specialist.firm}
          </p>
          <p className="text-[#999999] text-xs mt-1">
            {specialist.categoryName}
          </p>
        </div>
        {!simplified && specialist.rating && (
          <div className="flex justify-between">
            <div className="flex flex-1 flex-col justify-center items-center">
              <p className="text-[#666666] text-xs sm:text-sm lg:text-[13px] leading-tight mt-2">
                Оценок
              </p>
              <p className="flex items-center gap-1 text-[#333333] text-xs leading-tight mt-1">
                <ThumbsUp className="text-xs" width={12} />{" "}
                {specialist.likes || 0}
              </p>
            </div>
            <Separator orientation="vertical" className="mx-4" />
            <div className="flex flex-1 flex-col justify-center items-center">
              <p className="text-[#666666] text-xs sm:text-sm lg:text-[13px] leading-tight mt-2">
                Просмотров
              </p>
              <p className="flex items-center gap-1 text-[#333333] text-xs leading-tight mt-1">
                <Eye className="text-xs" width={12} /> {specialist.views || 0}
              </p>
            </div>
          </div>
        )}
      </Card>
    </Link>
  );
}
