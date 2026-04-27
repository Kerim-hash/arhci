// types/project.ts
export interface ProjectImage {
  id: number;
  url: string;
  isPreview: boolean;
  alt?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  specialistId: number; // Связь со специалистом
  specialistSlug: string;
  previewImage: string; // Главное изображение
  images: ProjectImage[]; // Все изображения проекта
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  specialistName: string; // Имя специалиста для отображения
  specialistAvatar: string; // Аватар специалиста для отображения
}

export interface CreateProjectDTO {
  title: string;
  description: string;
  specialistId: number;
  previewImage: string;
  images: Omit<ProjectImage, "id">[];
}

export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {
  id: number;
}
