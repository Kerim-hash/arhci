// app/work/resume/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useApiResumesRetrieveQuery } from "@/services/generatedApi";
import { ResumeDetailComponent } from "../../components/ResumeDetail";

export default function ResumePage() {
  const params = useParams();
  const resumeId = Number(params.id);

  const { data: resume, isLoading, error } = useApiResumesRetrieveQuery(
    { id: resumeId },
    { skip: isNaN(resumeId) }
  );

  if (isLoading)
    return <div className="container mx-auto px-4 py-8">Загрузка...</div>;
  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">
        Ошибка загрузки
      </div>
    );
  if (!resume) return null;

  return <ResumeDetailComponent resume={resume as any} />;
}
