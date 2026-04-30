// components/ResumesList.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { setSearchQuery } from "@/app/store/features/resumesSlice";
import { useApiResumesListQuery } from "@/services/generatedApi";
import { ResumeCard } from "./ResumeCard";

export function ResumesList() {
  const dispatch = useAppDispatch();
  const { searchQuery } = useAppSelector((state) => state.resumes);

  const { data, isLoading } = useApiResumesListQuery({
    search: searchQuery || undefined,
  });
  const resumes = data?.results || [];

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          leftIcon={<Search className="text-gray-400 h-4 w-4" />}
          placeholder="Поиск резюме..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="pl-10 rounded-[40px]"
        />
      </div>

      <div className="space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {resumes.map((resume: any) => (
          <ResumeCard key={resume.id} resume={resume} />
        ))}

        {resumes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Ничего не найдено
          </div>
        )}
      </div>
    </div>
  );
}
