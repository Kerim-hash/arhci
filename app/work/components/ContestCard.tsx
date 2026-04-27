// components/ContestCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Competition } from "@/types/competition";

interface ContestCardProps {
  competition: Competition;
}

export function ContestCard({ competition }: ContestCardProps) {
  return (
    <Card className="border border-[#F1EFEF] transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-start gap-4">
          <Link href={`/work/competitions/${competition.slug}`} className="flex-1">
            <div>
              <h3 className="text-[24px] font-bold mb-2 text-primary">
                {competition.title}
              </h3>

              <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                {competition.shortDescription}
              </p>

              <div className="flex items-center gap-3 mb-3 flex-wrap">
                {competition.prize && (
                  <div className="flex items-center gap-1 text-primary font-medium">
                    <span>Приз: {competition.prize}</span>
                  </div>
                )}
                <div className="flex bg-[#F5F5F7] px-2 py-1 rounded-[40px] items-center gap-1 text-[#949494]">
                  <span className="text-sm">Организатор: {competition.organizer}</span>
                </div>
                {competition.city && (
                  <div className="flex bg-[#F5F5F7] px-2 py-1 rounded-[40px] items-center gap-1 text-[#949494]">
                    <span className="text-sm">{competition.city}, {competition.country}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 text-[#949494]">
                <span className="text-sm">Дедлайн: {competition.dates.submissionDeadline}</span>
              </div>
            </div>
            
            <div onClick={(e) => e.stopPropagation()}>
              <Button className="mt-8 rounded-[40px] whitespace-nowrap">
                Подробнее
              </Button>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
