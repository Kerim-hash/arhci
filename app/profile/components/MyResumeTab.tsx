"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useApiResumesListQuery } from "@/services/generatedApi";
import { EmptyState } from "@/components/EmptyState";
import { ModerationStatusBadge } from "@/components/ModerationStatusBadge";

export function MyResumeTab() {
  const { data, isLoading } = useApiResumesListQuery({ mine: true });
  const resumes = data?.results || [];

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
  }

  if (resumes.length === 0) {
    return (
      <EmptyState
        title="Пока нет ни одного резюме"
        description="Опубликуйте резюме, чтобы работодатели могли предложить вам вакансию."
        actionLabel="Создать резюме"
        actionHref="/work/resume/create"
      />
    );
  }

  return (
    <div className="space-y-4">
      {resumes.map((resume) => (
        <Link key={resume.id} href={`/work/resume/${resume.id}`} className="block">
          <Card className="border border-[#F1EFEF] transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold text-primary">{resume.name}</h3>
                <ModerationStatusBadge status={resume.moderationStatus} />
              </div>

              <div className="flex items-center gap-3 mt-2 mb-3 flex-wrap">
                {!!resume.salaryFrom && (
                  <span className="text-primary font-medium">
                    от {resume.salaryFrom.toLocaleString()} сом
                  </span>
                )}
                {resume.experience && (
                  <div className="flex bg-[#F5F5F7] px-2 py-1 rounded-[40px] items-center gap-1 text-[#949494]">
                    <span className="text-sm">Опыт {resume.experience}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
