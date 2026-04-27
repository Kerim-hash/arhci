// components/ContestsList.tsx
"use client";

import { useAppSelector } from "@/app/store/hooks";
import Link from "next/link";

export function ContestsList() {
  const { competitions } = useAppSelector((state) => state.competitions);

  const activeCompetitions = competitions.filter((c) => c.isActive);
  const pastCompetitions = competitions.filter((c) => !c.isActive);

  return (
    <div className="space-y-10">
      {/* Актуальные */}
      {activeCompetitions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Актуальные</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeCompetitions.map((competition) => (
              <Link
                key={competition.id}
                href={`/work/competitions/${competition.slug}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-lg aspect-[4/3] bg-gray-100">
                  <img
                    src={competition.image}
                    alt={competition.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-[#333] line-clamp-2 leading-tight">
                  {competition.title}
                </p>
              </Link>
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
              <Link
                key={competition.id}
                href={`/work/competitions/${competition.slug}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-lg aspect-[4/3] bg-gray-100">
                  <img
                    src={competition.image}
                    alt={competition.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-80"
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-[#333] line-clamp-2 leading-tight">
                  {competition.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {competitions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Конкурсы не найдены
        </div>
      )}
    </div>
  );
}
