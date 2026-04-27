// types/vacancy.ts
export interface VacancyDetail {
  id: number;
  title: string;
  salaryFrom?: number;
  salaryTo?: number;
  currency: string;
  experience?: string; // Опыт работы
  rating?: number;
  workTags: string[];
  description?: string;
  responsibilities: string[];
  requirements: string[];
  offers: string[];
  keySkills: string[];

  // Детали работы
  workPlace?: string; // Место работы
  employment?: string; // Занятость
  schedule?: string; // График
  workingHours?: string; // Рабочие часы
  workFormat?: string; // Формат работы

  company: {
    name: string;
    logo?: string;
    address: string;
    website?: string;
    phone?: string;
    email?: string;
    description?: string;
  };

  publisher?: {
    name: string;
    position?: string;
    phone?: string;
    email?: string;
    avatar?: string;
  };

  createdAt: string;
  viewsCount: number;
  isSaved: boolean;
  similarVacancies?: SimilarVacancy[];
}

export interface SimilarVacancy {
  id: number;
  title: string;
  salaryFrom?: number;
  salaryTo?: number;
  salaryType?: string;
  currency?: string;
  experience?: string; // Опыт для похожих вакансий
  rating: number;
  company: string;
  address: string;
}
