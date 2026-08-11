// components/ProjectCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, ThumbsUp } from "lucide-react";
import type { ProjectListRead } from "@/services/generatedApi";
import { useApiProjectsRetrieveQuery } from "@/services/generatedApi";

interface ProjectCardProps {
  project: ProjectListRead;
  category?: string;
}

const getPlaceholder = (cat?: string, projectId?: number) => {
  switch (cat) {
    case "architects": return "/placeholder-architect.png";
    case "engineers": return "/placeholder-engineer.png";
    case "interior-designers": return "/placeholder-designer.png";
    case "visualizers": return "/placeholder-visualizer.png";
    default: {
      const placeholders = [
        "/placeholder-architect.png",
        "/placeholder-engineer.png",
        "/placeholder-designer.png",
        "/placeholder-visualizer.png"
      ];
      return placeholders[(projectId || 0) % placeholders.length];
    }
  }
};

export default function ProjectCard({ project, category }: ProjectCardProps) {
  // The projects list endpoint doesn't populate previewImage even when the
  // project has uploaded images, so fall back to fetching the detail once
  // to read the real image (isPreview one, or the first uploaded image).
  const { data: detail } = useApiProjectsRetrieveQuery(
    { id: project.id },
    { skip: !!project.previewImage }
  );
  const fallbackImage = detail?.images?.find((img) => img.isPreview)?.image
    || detail?.images?.[0]?.image;
  const imageSrc = project.previewImage || fallbackImage || getPlaceholder(category, project.id);

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="relative overflow-hidden max-h-[200px] h-[200px] rounded-lg bg-gray-100">
        <Image
          src={imageSrc}
          alt={project.title}
          fill
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
