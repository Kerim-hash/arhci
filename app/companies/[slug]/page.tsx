import type { Metadata } from "next";

import { fetchApi } from "@/lib/serverApi";
import type {
  CompanyDetailRead,
  PaginatedVacancyListListRead,
} from "@/services/generatedApi";

import CompanyProfilePage from "../components/CompanyProfilePage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const DESCRIPTION_LENGTH = 160;

// Пустой список: страницы компаний не собираются при сборке, а кэшируются по первому заходу
export function generateStaticParams() {
  return [];
}

function loadCompany(slug: string) {
  return fetchApi<CompanyDetailRead>(`/api/companies/${encodeURIComponent(slug)}/`);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = await loadCompany(slug);
  if (!company) return {};

  const title = company.name;
  const description =
    (company.description || "").slice(0, DESCRIPTION_LENGTH) ||
    `${title}: контакты и открытые вакансии`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: company.logo ? [company.logo] : [],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const initialCompany = await loadCompany(slug);
  // Те же параметры, с которыми страница запрашивает вакансии на клиенте
  const initialVacancies = initialCompany
    ? await fetchApi<PaginatedVacancyListListRead>(
        `/api/vacancies/?user=${initialCompany.userId}&page=1`,
      )
    : undefined;

  return (
    <CompanyProfilePage
      slug={slug}
      initialCompany={initialCompany}
      initialVacancies={initialVacancies}
    />
  );
}
