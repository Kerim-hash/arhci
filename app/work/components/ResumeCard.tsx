// components/ResumeCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Resume } from "@/app/store/features/resumesSlice";
import Link from "next/link";
import { RoleGuard } from "@/components/RoleGuard";

interface ResumeCardProps {
  resume: Resume;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  return (
    <Link href={`/work/resume/${resume.id}`} className="block">
      <Card className="border border-[#F1EFEF] transition-shadow">
        <CardContent className="p-5">
          <div>
            {/* Имя */}
            <h3 className="text-[24px] font-bold mb-2 text-primary">
              {resume.name}
            </h3>

            {/* Зарплата и опыт */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              {resume.salaryFrom > 0 && (
                <div className="flex items-center gap-1 text-primary font-medium">
                  <span>от {resume.salaryFrom.toLocaleString()} сом</span>
                </div>
              )}
              <div className="flex bg-[#F5F5F7] px-2 py-1 rounded-[40px] items-center gap-1 text-[#949494]">
                <span className="text-sm">Опыт {resume.experience}</span>
              </div>
            </div>

            {/* Описание */}
            <div className="flex items-center gap-1 mb-4 text-[#949494]">
              <span className="text-sm">{resume.description}</span>
            </div>

            {/* Кнопка */}
            <RoleGuard role="company">
              <div onClick={(e) => e.stopPropagation()}>
                <Button className="rounded-[40px] whitespace-nowrap">
                  Связаться
                </Button>
              </div>
            </RoleGuard>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
