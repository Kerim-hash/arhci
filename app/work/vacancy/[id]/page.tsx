// app/vacancy/[id]/page.tsx
"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  fetchVacancyDetail,
  clearVacancyDetail,
} from "@/app/store/features/vacancyDetailSlice";
import { VacancyDetailComponent } from "../../components/VacancyDetail";

export default function VacancyPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { vacancy, loading, error } = useAppSelector(
    (state) => state.vacancyDetail,
  );

  useEffect(() => {
    if (params.id) {
      dispatch(fetchVacancyDetail(params.id as string));
    }

    return () => {
      dispatch(clearVacancyDetail());
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
  if (!vacancy) return null;

  return <VacancyDetailComponent vacancy={vacancy} />;
}
