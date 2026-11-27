/** Параметры каталога компаний — общие для серверного первого экрана и клиентского списка. */

export const COMPANIES_DEFAULT_ORDERING = "-views";

export const COMPANY_SORT_OPTIONS = [
  { value: "-views", label: "По просмотрам" },
  { value: "-vacancies_count", label: "По числу вакансий" },
  { value: "name", label: "По названию (А-Я)" },
  { value: "-name", label: "По названию (Я-А)" },
] as const;

export const COMPANY_PLURAL_FORMS = ["компания", "компании", "компаний"] as const;
export const VACANCY_PLURAL_FORMS = ["вакансия", "вакансии", "вакансий"] as const;
export const PROJECT_PLURAL_FORMS = ["проект", "проекта", "проектов"] as const;

export const companyHref = (slug: string) => `/companies/${encodeURIComponent(slug)}`;
