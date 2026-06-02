// components/ProjectCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Eye, ThumbsUp } from "lucide-react";
import type { ProjectListRead } from "@/services/generatedApi";

interface ProjectCardProps {
  project: ProjectListRead;
  category?: string;
}

export default function ProjectCard({ project, category }: ProjectCardProps) {
  const getPlaceholder = (cat?: string, projectId?: number) => {
    switch (cat) {
      case "architects": return "/placeholder-architect.png";
      case "engineers": return "/placeholder-engineer.png";
      case "interior-designers": return "/placeholder-designer.png";
      case "visualizers": return "/placeholder-visualizer.png";
      default:
        const placeholders = [
          "/placeholder-architect.png",
          "/placeholder-engineer.png",
          "/placeholder-designer.png",
          "/placeholder-visualizer.png"
        ];
        return placeholders[(projectId || 0) % placeholders.length];
    }
  };

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="relative  overflow-hidden max-h-[200px] h-[200px]">
        <Image
          src={project.preview_image || getPlaceholder(category, project.id)}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
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
