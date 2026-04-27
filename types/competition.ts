// types/competition.ts
export interface CompetitionDate {
  startRegistration: string;
  endRegistration: string;
  submissionDeadline: string;
  resultsAnnouncement: string;
}

export interface CompetitionPrize {
  title: string;
  amount: string;
  description?: string;
}

export interface Competition {
  id: number;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  openFor: string[]; // ['Профессионалы', 'Студенты']
  country: string;
  city: string;
  registrationFee: string;
  prize: string;
  organizer: string;
  organizerLink?: string;
  dates: CompetitionDate;
  tasks: string[];
  conditions: string[];
  projectComposition: string[];
  evaluationCriteria: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  participantsCount: number;
  isActive: boolean;
  isFeatured: boolean;
}

export interface CreateCompetitionDTO {
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  openFor: string[];
  country: string;
  city: string;
  registrationFee: string;
  prize: string;
  organizer: string;
  organizerLink?: string;
  dates: CompetitionDate;
  tasks: string[];
  conditions: string[];
  projectComposition: string[];
  evaluationCriteria: string[];
  isActive: boolean;
  isFeatured: boolean;
}