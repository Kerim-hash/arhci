// app/work/resume/[id]/page.tsx
"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  fetchResumeById,
  clearCurrentResume,
} from "@/app/store/features/resumesSlice";
import { ResumeDetailComponent } from "../../components/ResumeDetail";

export default function ResumePage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { currentResume, loading, error } = useAppSelector(
    (state) => state.resumes,
  );

  useEffect(() => {
    if (params.id) {
      dispatch(fetchResumeById(Number(params.id)));
    }

    return () => {
      dispatch(clearCurrentResume());
    };
  }, [params.id, dispatch]);

  if (loading)
    return <div className="container mx-auto px-4 py-8">Загрузка...</div>;
  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">
        Ошибка: {error}
      </div>
    );
  if (!currentResume) return null;

  return <ResumeDetailComponent resume={currentResume} />;
}
