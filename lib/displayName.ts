import type { User } from "@/types/user";

type NamedUser = Pick<
  User,
  "role" | "firstName" | "lastName" | "first_name" | "last_name" | "companyName" | "company_name"
>;

/**
 * Имя пользователя для карточек, превью и предзаполнения форм.
 *
 * Профиль с API не содержит поля `name`: у компании показываем название
 * компании, у специалиста — имя и фамилию, иначе нейтральное «Пользователь».
 */
export function displayName(user?: Partial<NamedUser> | null): string {
  if (!user) return "Пользователь";
  const company = (user.companyName || user.company_name || "").trim();
  if (user.role === "company" && company) return company;
  const person = [user.firstName || user.first_name, user.lastName || user.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return person || company || "Пользователь";
}
