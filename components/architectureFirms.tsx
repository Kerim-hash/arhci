"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { companyHref, PROJECT_PLURAL_FORMS } from "@/app/companies/model/listParams";
import { pluralRu } from "@/lib/pluralRu";
import {
  useApiCompaniesListQuery,
  useApiSpecialistsTopListQuery,
  type CompanyListRead,
  type PaginatedCompanyListListRead,
  type SpecialistListRead,
} from "@/services/generatedApi";

/**
 * Бюро на главной: шесть самых просматриваемых компаний (при равных
 * просмотрах — новые, это порядок /api/companies/ по умолчанию). Остальные —
 * по ссылке «Смотреть все» в каталоге /companies.
 */
const BUREAUS_LIMIT = 6;
const SPECIALISTS_LIMIT = 5;

interface ArchitectureFirmsProps {
  /** Первая страница каталога компаний и топ специалистов, полученные на сервере. */
  initialCompanies?: PaginatedCompanyListListRead;
  initialTop?: SpecialistListRead[];
}

export default function ArchitectureFirms({ initialCompanies, initialTop }: ArchitectureFirmsProps) {
  return (
    <div className="sticky top-27.5">
      <div className="max-w-4xl mx-auto">
        <BureausCard initialCompanies={initialCompanies} />
        <Separator className="bg-[#333333] mb-5" />
        <TopSpecialistsCard initialTop={initialTop} />
      </div>
    </div>
  );
}

function BureausCard({ initialCompanies }: { initialCompanies?: PaginatedCompanyListListRead }) {
  const query = useApiCompaniesListQuery({ page: 1 });
  const data = query.data ?? initialCompanies;
  const isLoading = query.isLoading && !data;
  const bureaus = data?.results.slice(0, BUREAUS_LIMIT) ?? [];

  return (
    <Card className="mb-5 p-5">
      <h5 className="text-[20px] font-semibold text-[#333333] mb-4">Архитектурные бюро</h5>

      {isLoading ? (
        <p className="text-gray-500 text-sm">Загрузка...</p>
      ) : bureaus.length > 0 ? (
        <ul className="space-y-3">
          {bureaus.map((company) => (
            <li key={company.id}>
              <BureauRow company={company} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">Нет данных</p>
      )}

      <Link
        href="/companies"
        className="block mt-4 text-sm font-medium text-[#4677F3] hover:underline"
      >
        Смотреть все →
      </Link>
    </Card>
  );
}

function BureauRow({ company }: { company: CompanyListRead }) {
  const logo = company.logo || "";

  return (
    <Link href={companyHref(company.slug)} className="group flex items-center gap-3 min-w-0">
      <div className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-[#F5F5F7]">
        <Image
          src={logo || "/user.svg"}
          width={36}
          height={36}
          alt=""
          className={`w-full h-full ${logo ? "object-cover" : "object-none"}`}
        />
      </div>
      <div className="min-w-0">
        <p className="text-[16px] text-[#333333] group-hover:text-[#4677F3] truncate">
          {company.name}
        </p>
        <p className="text-xs text-[#949494]">
          {company.projectsCount} {pluralRu(company.projectsCount, PROJECT_PLURAL_FORMS)}
        </p>
      </div>
    </Link>
  );
}

function TopSpecialistsCard({ initialTop }: { initialTop?: SpecialistListRead[] }) {
  const query = useApiSpecialistsTopListQuery({ page: 1 });
  const data = query.data ?? initialTop;
  const isLoading = query.isLoading && !data;
  // /api/specialists/top/ returns a plain array, not the paginated { results } shape.
  const topSpecialists: SpecialistListRead[] = Array.isArray(data)
    ? data
    : data?.results || [];

  // У компаний нет своей страницы в /specialists — ссылку вести некуда
  const linkableSpecialists = topSpecialists
    .filter((specialist) => specialist.category !== "companies")
    .slice(0, SPECIALISTS_LIMIT);

  return (
    <Card className="p-5">
      <h5 className="text-[20px] font-semibold text-[#333333] mb-4">Топ специалисты</h5>

      <div className="grid grid-cols-2 gap-3">
        {isLoading ? (
          <p className="text-gray-500 text-sm">Загрузка...</p>
        ) : linkableSpecialists.length > 0 ? (
          linkableSpecialists.map((specialist) => (
            <Link
              key={specialist.id}
              href={`/specialists/${specialist.category}/${specialist.slug}`}
              className="text-[#333333] text-[16px] hover:text-[#4677F3] truncate"
            >
              {specialist.name}
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Нет данных</p>
        )}
      </div>
    </Card>
  );
}
