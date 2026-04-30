// components/ProjectCard.tsx
import Link from "next/link";
import { Eye, ThumbsUp } from "lucide-react";
import type { ProjectListRead } from "@/services/generatedApi";

interface ProjectCardProps {
  project: ProjectListRead;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="relative  overflow-hidden max-h-[200px] h-[200px]">
        <img
          src={project.preview_image || '/placeholder-project.jpg'}
          alt={project.title}
          className="w-full h-[200px] max-h-[200px] object-cover  transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="mt-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm text-[#666666]">
              {project.specialist_name || ''}
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
