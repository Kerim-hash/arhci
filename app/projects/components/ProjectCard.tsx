// components/ProjectCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, ThumbsUp } from "lucide-react";
import type { ProjectListRead } from "@/services/generatedApi";

interface ProjectCardProps {
  project: ProjectListRead;
  category?: string;
}

const PLACEHOLDERS: Record<string, string> = {
  architects: "/placeholder-architect.png",
  engineers: "/placeholder-engineer.png",
  constructors: "/placeholder-engineer.png",
  "interior-designers": "/placeholder-designer.png",
  visualizers: "/placeholder-visualizer.png",
};

const getPlaceholder = (category?: string, projectId?: number) => {
  if (category && PLACEHOLDERS[category]) return PLACEHOLDERS[category];
  const all = Object.values(PLACEHOLDERS);
  return all[(projectId || 0) % all.length];
};

export default function ProjectCard({ project, category }: ProjectCardProps) {
  // Обложку отдаёт сам список: бэкенд подставляет первую картинку проекта,
  // поэтому отдельный запрос детали на каждую карточку больше не нужен.
  const imageSrc = project.previewImage || getPlaceholder(category, project.id);

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="relative overflow-hidden max-h-[200px] h-[200px] rounded-lg bg-gray-100">
        <Image
          src={imageSrc}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="mt-2 space-y-1">
        <h3 className="font-semibold text-sm text-[#333333] line-clamp-1 hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xs text-[#666666]">
              {project.specialistName || ""}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[#666666] text-xs">
              <Eye className="w-3 h-3" />
              <span>{project.views || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-[#666666] text-xs">
              <ThumbsUp className="w-3 h-3" />
              <span>{project.likes || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
