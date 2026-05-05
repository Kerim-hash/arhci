export type UserRole = "specialist" | "company";

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  image?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  is_verified: boolean;
  specialistSlug?: string;
  specialistId?: number;
  phone?: string;
  bio?: string;
  position?: string;
  company_name?: string;
  companyName?: string;
  firm?: string;
  specialization?: string;
  experience_years?: number;
  experienceYears?: number;
  instagram?: string;
  telegram?: string;
  linkedin?: string;
  behance?: string;
  website?: string;
}

