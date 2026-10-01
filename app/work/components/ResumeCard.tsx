// components/ResumeCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ResumeListRead } from "@/services/generatedApi";
import Link from "next/link";
import { RoleGuard } from "@/components/RoleGuard";
import { asStringArray, formatSalaryRange } from "../model/format";

const KEY_SKILLS_PREVIEW_LIMIT = 5;

interface ResumeCardProps {
  resume: ResumeListRead;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const href = `/work/resume/${resume.id}`;
  const salary = formatSalaryRange(resume.salaryFrom, resume.salaryTo);
  const specialization = asStringArray(resume.specialization).join(", ");
  const keySkills = asStringArray(resume.keySkills).slice(0, KEY_SKILLS_PREVIEW_LIMIT);

  return (
    <Card className="border border-[#F1EFEF] transition-shadow">
      <CardContent className="p-5">
        <Link href={href} className="block">
          {/* Имя */}
          <h3 className="text-[24px] font-bold mb-2 text-primary">
            {resume.name}
          </h3>

          {/* Зарплата и опыт */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {salary && (
              <div className="flex items-center gap-1 text-primary font-medium">
                <span>{salary}</span>
              </div>
            )}
            {resume.experience && (
              <div className="flex bg-[#F5F5F7] px-2 py-1 rounded-[40px] items-center gap-1 text-[#949494]">
                <span className="text-sm">Опыт {resume.experience}</span>
              </div>
            )}
          </div>

          {/* Специализация и регион — в списке нет описания */}
          {(specialization || resume.region) && (
            <div className="flex items-center gap-1 mb-2 text-[#949494]">
              <span className="text-sm">
                {[specialization, resume.region].filter(Boolean).join(" · ")}
              </span>
            </div>
          )}

          {keySkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {keySkills.map((skill) => (
                <span key={skill} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </Link>

        {/* Кнопка — сосед ссылки, а не её потомок */}
        <RoleGuard role="company">
          <Button asChild className="rounded-[40px] whitespace-nowrap">
            <Link href={href}>Связаться</Link>
          </Button>
        </RoleGuard>
      </CardContent>
    </Card>
  );
}
