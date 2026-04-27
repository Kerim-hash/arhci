// types/specialists.ts
export type SpecialistCategory =
  | "architects"
  | "engineers"
  | "interior-designers"
  | "visualizers";

export interface Specialist {
  experience: any;
  specialization: any;
  position: string;
  id: number;
  slug: string;
  name: string;
  category: SpecialistCategory;
  categoryName: string;
  firm: string;
  avatar: string;
  description: string;
  rating?: number;
  views?: number;
  likes?: number;
}

export interface CategoryInfo {
  id: SpecialistCategory;
  title: string;
  icon?: string;
}
