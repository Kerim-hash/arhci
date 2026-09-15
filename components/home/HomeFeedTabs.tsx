"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn, stripHtml } from "@/lib/utils";
import {
  useApiArticlesListQuery,
  useApiCompetitionsListQuery,
  useApiProjectsListQuery,
  useApiSpecialistsListQuery,
} from "@/services/generatedApi";
import SpecialistCard from "@/app/specialists/components/SpecialistCard";

type FeedTab = "articles" | "competitions" | "persons" | "objects";

interface TabConfig {
  id: FeedTab;
  label: string;
  href: string;
}

const TABS: TabConfig[] = [
  { id: "articles", label: "Статьи", href: "/articles" },
  { id: "competitions", label: "Конкурсы", href: "/competitions" },
  { id: "persons", label: "Личности", href: "/specialists" },
  { id: "objects", label: "Объект", href: "/projects" },
];

const DEFAULT_TAB: FeedTab = "articles";
const FEED_LIMIT = 3;
const PERSONS_LIMIT = 4;

const ARTICLE_CATEGORIES = ["Личности", "Архитектура", "Дизайн", "Искусство"];
const articleCategory = (id: number) => ARTICLE_CATEGORIES[id % ARTICLE_CATEGORIES.length];

interface FeedCardProps {
  href: string;
  title: string;
  image?: string | null;
  badge?: string;
  description?: string;
  views?: number;
}

function FeedCard({ href, title, image, badge, description, views }: FeedCardProps) {
  return (
    <Link href={href} className="group">
      <Card className="overflow-hidden mb-4 md:mb-6 p-0 gap-0">
        <div className="relative aspect-video md:aspect-[2/5] overflow-hidden md:max-h-[320px] w-full bg-gray-100">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover w-full transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">Нет изображения</span>
            </div>
          )}
          {badge && (
            <Badge variant="secondary" className="absolute bottom-3 right-3 text-xs">
              {badge}
            </Badge>
          )}
        </div>

        <div className="p-4 md:p-6">
          <h2 className="text-lg sm:text-xl md:text-[32px] font-medium leading-tight group-hover:underline mb-3">
            {title}
          </h2>
          <p className="text-sm md:text-[16px] text-[#6D6D6D] leading-relaxed line-clamp-3 md:line-clamp-4 mb-4">
            {description || "Описание отсутствует"}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Eye className="w-3.5 h-3.5" />
            <span>{views || 0}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function PanelMessage({ children }: { children: ReactNode }) {
  return <p className="text-gray-500 py-4">{children}</p>;
}

interface PanelProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  emptyText: string;
  children: ReactNode;
}

function Panel({ isLoading, isError, isEmpty, emptyText, children }: PanelProps) {
  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
  }
  if (isError) {
    return <PanelMessage>Не удалось загрузить данные. Попробуйте обновить страницу.</PanelMessage>;
  }
  if (isEmpty) {
    return <PanelMessage>{emptyText}</PanelMessage>;
  }
  return <>{children}</>;
}

/**
 * Рубрики на главной: контент переключается внутри блока, без перехода
 * на другие страницы. Данные каждой вкладки запрашиваются только когда
 * она активна (skip), а RTK Query кэширует их при повторном открытии.
 */
export default function HomeFeedTabs() {
  const [activeTab, setActiveTab] = useState<FeedTab>(DEFAULT_TAB);

  const articles = useApiArticlesListQuery({ page: 1 }, { skip: activeTab !== "articles" });
  const competitions = useApiCompetitionsListQuery(
    { page: 1 },
    { skip: activeTab !== "competitions" },
  );
  const persons = useApiSpecialistsListQuery(
    { ordering: "-rating", page: 1 },
    { skip: activeTab !== "persons" },
  );
  const objects = useApiProjectsListQuery(
    { ordering: "-created_at", page: 1 },
    { skip: activeTab !== "objects" },
  );

  const articleItems = articles.data?.results?.slice(0, FEED_LIMIT) ?? [];
  const competitionItems = competitions.data?.results?.slice(0, FEED_LIMIT) ?? [];
  const personItems = persons.data?.results?.slice(0, PERSONS_LIMIT) ?? [];
  const objectItems = objects.data?.results?.slice(0, FEED_LIMIT) ?? [];

  const activeConfig = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];

  const renderPanel = () => {
    switch (activeTab) {
      case "articles":
        return (
          <Panel
            isLoading={articles.isLoading}
            isError={articles.isError}
            isEmpty={articleItems.length === 0}
            emptyText="Нет доступных статей."
          >
            {articleItems.map((item) => (
              <FeedCard
                key={item.id}
                href={`/articles/${item.slug}`}
                title={item.title}
                image={item.previewImage}
                badge={articleCategory(item.id)}
                description={stripHtml(item.shortDescription ?? "")}
                views={item.views}
              />
            ))}
          </Panel>
        );
      case "competitions":
        return (
          <Panel
            isLoading={competitions.isLoading}
            isError={competitions.isError}
            isEmpty={competitionItems.length === 0}
            emptyText="Нет доступных конкурсов."
          >
            {competitionItems.map((item) => (
              <FeedCard
                key={item.id}
                href={`/competitions/${item.slug}`}
                title={item.title}
                image={item.image}
                badge={item.isActive ? "Активный" : "Завершён"}
                description={stripHtml(item.shortDescription ?? "")}
                views={item.views}
              />
            ))}
          </Panel>
        );
      case "persons":
        return (
          <Panel
            isLoading={persons.isLoading}
            isError={persons.isError}
            isEmpty={personItems.length === 0}
            emptyText="Нет доступных специалистов."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {personItems.map((specialist) => (
                <SpecialistCard key={specialist.id} specialist={specialist} simplified />
              ))}
            </div>
          </Panel>
        );
      case "objects":
        return (
          <Panel
            isLoading={objects.isLoading}
            isError={objects.isError}
            isEmpty={objectItems.length === 0}
            emptyText="Нет доступных проектов."
          >
            {objectItems.map((item) => (
              <FeedCard
                key={item.id}
                href={`/projects/${item.id}`}
                title={item.title}
                image={item.previewImage}
                badge="Объект"
                description={item.specialistName}
                views={item.views}
              />
            ))}
          </Panel>
        );
    }
  };

  return (
    <>
      <div
        role="tablist"
        aria-label="Рубрики"
        className="flex overflow-x-auto gap-6 mb-4 scrollbar-none"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`home-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`home-panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "text-[16px] whitespace-nowrap pb-1 border-b-2 transition-colors cursor-pointer",
                isActive
                  ? "font-semibold text-foreground border-foreground"
                  : "font-normal text-muted-foreground border-transparent hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`home-panel-${activeTab}`}
        aria-labelledby={`home-tab-${activeTab}`}
        className="space-y-4 md:space-y-6"
      >
        {renderPanel()}
      </div>

      <Link
        href={activeConfig.href}
        className="inline-block mt-2 text-sm font-medium text-[#333333] hover:underline"
      >
        Смотреть все →
      </Link>
    </>
  );
}
