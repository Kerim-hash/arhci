export type UserRole = "specialist" | "company";

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  image?: string;
  name?: string;
  role: UserRole;
  is_verified: boolean;
  specialistSlug?: string;
  specialistId?: number;
}

