// components/ContestCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { CompetitionListRead } from "@/services/generatedApi";

interface ContestCardProps {
  competition: CompetitionListRead;
}

function formatDeadline(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
}

export function ContestCard({ competition }: ContestCardProps) {
  const href = `/competitions/${competition.slug}`;
  const deadline = formatDeadline(competition.submissionDeadline);
  const location = [competition.city, competition.country].filter(Boolean).join(", ");

  return (
    <Card className="border border-[#F1EFEF] transition-shadow">
      <CardContent className="p-5">
        <Link href={href} className="block">
          <h3 className="text-[24px] font-bold mb-2 text-primary">
            {competition.title}
          </h3>

          {competition.shortDescription && (
            <p className="text-gray-600 mb-4 text-sm line-clamp-2">
              {competition.shortDescription}
            </p>
          )}

          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {competition.prize && (
              <div className="flex items-center gap-1 text-primary font-medium">
                <span>Приз: {competition.prize}</span>
              </div>
            )}
            {competition.organizer && (
              <div className="flex bg-[#F5F5F7] px-2 py-1 rounded-[40px] items-center gap-1 text-[#949494]">
                <span className="text-sm">Организатор: {competition.organizer}</span>
              </div>
            )}
            {location && (
              <div className="flex bg-[#F5F5F7] px-2 py-1 rounded-[40px] items-center gap-1 text-[#949494]">
                <span className="text-sm">{location}</span>
              </div>
            )}
          </div>

          {deadline && (
            <div className="flex items-center gap-1 text-[#949494]">
              <span className="text-sm">Дедлайн: {deadline}</span>
            </div>
          )}
        </Link>

        {/* Кнопка — сосед ссылки, а не её потомок */}
        <Button asChild className="mt-8 rounded-[40px] whitespace-nowrap">
          <Link href={href}>Подробнее</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
