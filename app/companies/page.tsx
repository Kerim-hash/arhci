import type { Metadata } from "next";

import { fetchApi } from "@/lib/serverApi";
import type { PaginatedCompanyListListRead } from "@/services/generatedApi";

import CompaniesPage from "./components/CompaniesPage";
import { COMPANIES_DEFAULT_ORDERING } from "./model/listParams";

export const metadata: Metadata = {
  title: "Компании",
  description:
    "Архитектурные бюро, студии и строительные компании Кыргызстана — контакты и открытые вакансии",
};

export default async function Page() {
  // Те же параметры, с которыми каталог запрашивает список на клиенте
  const initialPage = await fetchApi<PaginatedCompanyListListRead>(
    `/api/companies/?ordering=${COMPANIES_DEFAULT_ORDERING}&page=1`,
  );

  return <CompaniesPage initialPage={initialPage} />;
}
