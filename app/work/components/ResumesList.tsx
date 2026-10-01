// components/ResumesList.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { setSearchQuery } from "@/app/store/features/resumesSlice";
import { useApiResumesListQuery } from "@/services/generatedApi";
import { useDebounce } from "@/hooks/use-debounce";
import { usePagedQuery } from "../model/usePagedQuery";
import { ResumeCard } from "./ResumeCard";
import { LoadMoreButton } from "./LoadMoreButton";

const SEARCH_DEBOUNCE_MS = 300;

export function ResumesList() {
  const dispatch = useAppDispatch();
  const { searchQuery, filters } = useAppSelector((state) => state.resumes);
  const debouncedSearch = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  const { items: resumes, hasMore, isLoading, isLoadingMore, loadMore } = usePagedQuery(
    useApiResumesListQuery,
    {
      search: debouncedSearch || undefined,
      specialization: filters.specializations.join(",") || undefined,
      experience: filters.experience || undefined,
      region: filters.region && filters.region !== "all" ? filters.region : undefined,
      salaryFrom: filters.incomeFrom ? Number(filters.incomeFrom) : undefined,
    },
  );

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

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Загрузка...</div>
      ) : (
        <div className="space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}

          {resumes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Ничего не найдено
            </div>
          )}

          <LoadMoreButton hasMore={hasMore} isLoading={isLoadingMore} onClick={loadMore} />
        </div>
      )}
    </div>
  );
}
