// components/ContestsList.tsx
"use client";

import {
  useApiCompetitionsListQuery,
  type CompetitionListRead,
} from "@/services/generatedApi";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { usePagedQuery } from "../model/usePagedQuery";
import { LoadMoreButton } from "./LoadMoreButton";

function CompetitionTile({
  competition,
  isPast,
}: {
  competition: CompetitionListRead;
  isPast?: boolean;
}) {
  return (
    <Link href={`/competitions/${competition.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-lg aspect-[4/3] bg-gray-100">
        {/* next/image с пустым src падает — без обложки показываем заглушку */}
        {competition.image ? (
          <Image
            src={competition.image}
            alt={competition.title}
            fill
            className={`object-cover transition-transform duration-300 group-hover:scale-105${
              isPast ? " opacity-80" : ""
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <ImageIcon className="w-8 h-8" />
          </div>
        )}
      </div>
      <p className="mt-2 text-sm font-medium text-[#333] line-clamp-2 leading-tight">
        {competition.title}
      </p>
    </Link>
  );
}

export function ContestsList() {
  const { items: competitions, hasMore, isLoading, isLoadingMore, loadMore } = usePagedQuery(
    useApiCompetitionsListQuery,
    {},
  );

  const activeCompetitions = competitions.filter((c) => c.isActive);
  const pastCompetitions = competitions.filter((c) => !c.isActive);

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
  }

  return (
    <div className="space-y-10">
      {/* Актуальные */}
      {activeCompetitions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Актуальные</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeCompetitions.map((competition) => (
              <CompetitionTile key={competition.id} competition={competition} />
            ))}
          </div>
        </div>
      )}

      {/* Прошедшие */}
      {pastCompetitions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Прошедшие</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {pastCompetitions.map((competition) => (
              <CompetitionTile key={competition.id} competition={competition} isPast />
            ))}
          </div>
        </div>
      )}

      {competitions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Конкурсы не найдены
        </div>
      )}

      <LoadMoreButton hasMore={hasMore} isLoading={isLoadingMore} onClick={loadMore} />
    </div>
  );
}
