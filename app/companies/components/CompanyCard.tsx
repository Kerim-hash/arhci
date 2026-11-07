import Image from "next/image";
import Link from "next/link";
import { Briefcase, Eye, MapPin } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CompanyListRead } from "@/services/generatedApi";

import { companyHref } from "../model/listParams";

interface CompanyCardProps {
  company: CompanyListRead;
}

/** Карточка каталога компаний; ведёт на /companies/{slug}. */
export default function CompanyCard({ company }: CompanyCardProps) {
  // Логотип — аватар аккаунта компании; без него — нейтральная заглушка
  const logo = company.logo || "";

  return (
    <Link
      href={companyHref(company.slug)}
      className="flex flex-col rounded-lg hover:bg-gray-50 transition-colors"
    >
      <Card className="text-center gap-6 h-full">
        <div className="rounded-full mx-auto w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] overflow-hidden border-4 border-white bg-[#F5F5F7]">
          <Image
            src={logo || "/user.svg"}
            width={80}
            height={80}
            alt={company.name}
            className={`w-full h-full ${logo ? "object-cover" : "object-none"}`}
          />
        </div>
        <div className="min-w-0 px-2">
          <h3 className="text-[18px] sm:text-[19px] lg:text-[22px] font-semibold leading-tight truncate">
            {company.name}
          </h3>
          {company.address && (
            <p className="flex items-center justify-center gap-1 text-[#666666] text-sm leading-tight mt-1 min-w-0">
              <MapPin width={14} className="shrink-0" />
              <span className="truncate">{company.address}</span>
            </p>
          )}
        </div>
        <div className="flex justify-between">
          <div className="flex flex-1 flex-col justify-center items-center">
            <p className="text-[#666666] text-xs sm:text-sm lg:text-[13px] leading-tight mt-2">
              Вакансий
            </p>
            <p className="flex items-center gap-1 text-[#333333] text-xs leading-tight mt-1">
              <Briefcase width={12} /> {company.vacanciesCount}
            </p>
          </div>
          <Separator orientation="vertical" className="mx-4" />
          <div className="flex flex-1 flex-col justify-center items-center">
            <p className="text-[#666666] text-xs sm:text-sm lg:text-[13px] leading-tight mt-2">
              Просмотров
            </p>
            <p className="flex items-center gap-1 text-[#333333] text-xs leading-tight mt-1">
              <Eye width={12} /> {company.views ?? 0}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
