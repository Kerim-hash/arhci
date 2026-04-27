// components/ProjectCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Eye, ThumbsUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Project } from "@/types/project";
import { Specialist } from "@/types/specialists";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      {/* <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"> */}
      <div className="relative  overflow-hidden max-h-[200px] h-[200px]">
        <img
          src={project.previewImage}
          alt={project.title}
          className="w-full h-[200px] max-h-[200px] object-cover  transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="mt-2">
        {/* <h3 className="font-semibold text-lg mb-2 line-clamp-1">
            {project.title}
          </h3>
          <p className="text-[#666666] text-sm mb-3 line-clamp-2">
            {project.description}
          </p> */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              className="w-4 h-4 rounded-full"
              src={project.specialistAvatar}
              alt={project.specialistName}
            />
            <span className="text-sm text-[#666666] ml-2">
              {project.specialistName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[#666666] text-xs">
              <Eye className="w-3 h-3" />
              <span>{project.views}</span>
            </div>
            <div className="flex items-center gap-1 text-[#666666] text-xs">
              <ThumbsUp className="w-3 h-3" />
              <span>{project.likes}</span>
            </div>
          </div>
          {/* <span className="text-xs text-[#999999]">
              {new Date(project.createdAt).toLocaleDateString("ru-RU")}
            </span> */}
        </div>
      </div>
      {/* </Card> */}
    </Link>
  );
}
