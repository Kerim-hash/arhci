"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building2, Globe, Mail, MapPin, Phone, Plus, Share2 } from "lucide-react";

import { useAppSelector } from "@/app/store/hooks";
import { LoadMoreButton } from "@/app/work/components/LoadMoreButton";
import { VacancyCard } from "@/app/work/components/VacancyCard";
import { usePagedQuery } from "@/app/work/model/usePagedQuery";
import ShareModal from "@/components/ShareModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { isNotFound } from "@/lib/isNotFound";
import {
  useApiCompaniesRetrieveQuery,
  useApiCompaniesViewsCreateMutation,
  useApiVacanciesListQuery,
  type CompanyDetailRead,
  type PaginatedProjectListListRead,
  type PaginatedVacancyListListRead,
} from "@/services/generatedApi";

import CompanyProjects from "./CompanyProjects";

/** Адрес сайта для подписи ссылки: без протокола и завершающего слэша. */
const websiteLabel = (url: string) => url.replace(/^https?:\/\//i, "").replace(/\/$/, "");

interface CompanyProfilePageProps {
  slug: string;
  /** Компания, её проекты и вакансии с сервера (анонимный запрос). */
  initialCompany?: CompanyDetailRead;
  initialProjects?: PaginatedProjectListListRead;
  initialVacancies?: PaginatedVacancyListListRead;
}

/** Страница компании — по образцу профиля специалиста: проекты, вакансии, контакты. */
export default function CompanyProfilePage({
  slug,
  initialCompany,
  initialProjects,
  initialVacancies,
}: CompanyProfilePageProps) {
  const companyQuery = useApiCompaniesRetrieveQuery({ slug }, { skip: !slug });
  // Серверная копия не показывается, если API уже ответил, что компании нет
  const company =
    companyQuery.data ?? (isNotFound(companyQuery.error) ? undefined : initialCompany);
  const [incrementViews] = useApiCompaniesViewsCreateMutation();
  const user = useAppSelector((state) => state.authSlice.user);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Считаем просмотр один раз на загруженную компанию, а не на каждый рефетч
  const loadedId = company?.id;
  useEffect(() => {
    if (loadedId !== undefined) {
      incrementViews({ id: loadedId });
    }
  }, [loadedId, incrementViews]);

  if (!company) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-8">
        <div className="text-center py-12">
          {companyQuery.isError ? "Компания не найдена" : "Загрузка..."}
        </div>
      </section>
    );
  }

  // Серверный ответ анонимный — владельца узнаём и по своему профилю
  const isOwner = company.isOwner || (!!user?.companySlug && user.companySlug === slug);

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <Link href="/companies" className="hover:text-gray-700">
            Компании
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{company.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <CompanySidebar
            company={company}
            isOwner={isOwner}
            onShare={() => setIsShareOpen(true)}
          />
        </div>

        <div className="lg:col-span-9 space-y-12">
          {company.description && (
            <div>
              <h2 className="text-2xl font-bold mb-4">О компании</h2>
              <p className="text-[#666666] leading-relaxed whitespace-pre-line">
                {company.description}
              </p>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold mb-6">Проекты</h2>
            <CompanyProjects
              userId={company.userId}
              initialPage={initialProjects}
              isOwner={isOwner}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Вакансии</h2>
              {isOwner && (
                <Link
                  href="/work/vacancy/create"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  Создать вакансию
                </Link>
              )}
            </div>
            <CompanyVacancies
              userId={company.userId}
              initialPage={initialVacancies}
              isOwner={isOwner}
            />
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={company.name}
        subtitle={company.address || undefined}
        image={company.logo}
        imageFit="contain"
        views={company.views ?? 0}
      />
    </section>
  );
}

interface CompanySidebarProps {
  company: CompanyDetailRead;
  isOwner: boolean;
  onShare: () => void;
}

/** Левая колонка: логотип, контакты, показатели и действия — как у специалиста. */
function CompanySidebar({ company, isOwner, onShare }: CompanySidebarProps) {
  const logo = company.logo || "";

  return (
    <div className="sticky top-24 space-y-6">
      <div className="flex flex-col gap-8 mb-6">
        <Image
          src={logo || "/user.svg"}
          width={80}
          height={80}
          alt={company.name}
          className={`w-20 h-20 rounded-full ${logo ? "object-cover" : "object-none"}`}
          priority
        />

        <div className="w-full text-[14px]">
          <h1 className="text-3xl md:text-2xl font-bold mb-2">{company.name}</h1>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#949494]">
              <Building2 width={14} className="shrink-0" />
              <span>Компания</span>
            </div>
            {/* Показываем только заполненные контакты — без выдуманных */}
            {company.address && (
              <div className="flex items-start gap-2 text-[#949494]">
                <MapPin width={14} className="shrink-0 mt-0.5" />
                <span>{company.address}</span>
              </div>
            )}
            {company.phone && (
              <div className="flex items-center gap-2 text-[#949494]">
                <Phone width={14} className="shrink-0" />
                <a href={`tel:${company.phone}`} className="hover:text-[#333]">
                  {company.phone}
                </a>
              </div>
            )}
            {company.email && (
              <div className="flex items-center gap-2 text-[#949494] min-w-0">
                <Mail width={14} className="shrink-0" />
                <a href={`mailto:${company.email}`} className="truncate hover:text-[#333]">
                  {company.email}
                </a>
              </div>
            )}
            {company.website && (
              <div className="flex items-center gap-2 text-[#949494] min-w-0">
                <Globe width={14} className="shrink-0" />
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:text-[#333]"
                >
                  {websiteLabel(company.website)}
                </a>
              </div>
            )}
            <Separator className="my-6 bg-[#333] h-0.5" />
            <div className="flex justify-between items-center text-[14px]">
              <p>Просмотры</p>
              <p>{company.views ?? 0}</p>
            </div>
            <div className="flex justify-between items-center text-[14px]">
              <p>Проекты</p>
              <p>{company.projectsCount}</p>
            </div>
            <div className="flex justify-between items-center text-[14px]">
              <p>Вакансии</p>
              <p>{company.vacanciesCount}</p>
            </div>
            <Button variant="outline" className="w-full rounded-[40px] mt-2" onClick={onShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Поделиться
            </Button>
            {isOwner && (
              <Link href="/profile/settings?tab=company" className="block">
                <Button variant="outline" className="w-full rounded-[40px]">
                  Редактировать данные
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface CompanyVacanciesProps {
  userId: number;
  initialPage?: PaginatedVacancyListListRead;
  isOwner: boolean;
}

/**
 * Вакансии компании — /api/vacancies/?user=… со своей пагинацией.
 * Отдельный компонент: монтируется, когда userId уже известен, чтобы не
 * запрашивать список для несуществующего автора.
 */
function CompanyVacancies({ userId, initialPage, isOwner }: CompanyVacanciesProps) {
  const { items, hasMore, isLoading, isLoadingMore, isError, loadMore, retry } = usePagedQuery(
    useApiVacanciesListQuery,
    { user: userId },
    initialPage,
  );

  if (isLoading) {
    return <div className="text-center py-8 text-[#666666]">Загрузка...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-[#666666] mb-4">Не удалось загрузить вакансии.</p>
        <Button variant="outline" onClick={retry}>
          Повторить
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-[#666666]">
          {isOwner
            ? "У вас пока нет вакансий — опубликуйте первую"
            : "У компании пока нет открытых вакансий"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((vacancy) => (
        <VacancyCard key={vacancy.id} vacancy={vacancy} />
      ))}
      <LoadMoreButton hasMore={hasMore} isLoading={isLoadingMore} onClick={loadMore} />
    </div>
  );
}
