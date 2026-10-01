// components/MainPage.tsx (упрощенный вариант)
"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VacanciesList } from "./components/VacanciesList";
import { OrdersList } from "./components/OrdersList";
import { ContestsList } from "./components/ContestsList";
import { ResumesList } from "./components/ResumesList";
import { FiltersSidebar } from "./components/FiltersSidebar";
import { ResumeFiltersSidebar } from "./components/ResumeFiltersSidebar";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { setActiveTab } from "@/app/store/features/appSlice";
import { Button } from "@/components/ui/button";
import { RoleGuard } from "@/components/RoleGuard";
import { Plus } from "lucide-react";

const WORK_TABS = ["vacancies", "resumes", "orders", "contests"] as const;
type WorkTab = (typeof WORK_TABS)[number];

const isWorkTab = (value: string | null): value is WorkTab =>
  WORK_TABS.includes(value as WorkTab);

/**
 * Открывает вкладку из `?tab=` (ссылки «Заказы»/«Резюме» в хлебных крошках).
 * Вынесено в отдельный компонент под Suspense: useSearchParams без него
 * ломает статическую сборку страницы.
 */
function TabFromQuery() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  useEffect(() => {
    if (isWorkTab(tab)) dispatch(setActiveTab(tab));
  }, [tab, dispatch]);

  return null;
}

function MainPage() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.app.activeTab);

  const handleTabChange = (value: string) => {
    dispatch(setActiveTab(value));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "vacancies":
        return <VacanciesList />;
      case "orders":
        return <OrdersList />;
      case "resumes":
        return <ResumesList />;
      case "contests":
        return <ContestsList />;
      default:
        return <VacanciesList />;
    }
  };

  // У заказов и конкурсов нет фильтров на бэкенде — сайдбар не рисуем
  const renderFilters = () => {
    switch (activeTab) {
      case "vacancies":
        return <FiltersSidebar />;
      case "resumes":
        return <ResumeFiltersSidebar />;
      case "orders":
      case "contests":
        return null;
      default:
        return <FiltersSidebar />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={null}>
        <TabFromQuery />
      </Suspense>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
          <div className="w-full overflow-x-auto pb-1 mb-6 scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0">
            <TabsList className="grid gap-5 w-max min-w-full grid-cols-4">
              <TabsTrigger
                value="vacancies"
                className="data-[state=active]:bg-[#333] cursor-pointer data-[state=active]:text-[#F1EFEF] text-[#333333] flex items-center justify-center gap-2"
              >
                <Image src="/work.svg" alt="Вакансии" width={18} height={18} />
                Вакансии
              </TabsTrigger>

              <TabsTrigger
                value="resumes"
                className="data-[state=active]:bg-[#333] cursor-pointer data-[state=active]:text-[#F1EFEF] text-[#333333] flex items-center justify-center gap-2"
              >
                <Image
                  src="/file-vacan.svg"
                  alt="Резюме"
                  width={18}
                  height={18}
                />
                Резюме
              </TabsTrigger>

              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-[#333] cursor-pointer data-[state=active]:text-[#F1EFEF] text-[#333333] flex items-center justify-center gap-2"
              >
                <Image src="/list.svg" alt="Заказы" width={18} height={18} />
                Заказы
              </TabsTrigger>

              <TabsTrigger
                value="contests"
                className="data-[state=active]:bg-[#333] cursor-pointer data-[state=active]:text-[#F1EFEF] text-[#333333] flex items-center justify-center gap-2"
              >
                <Image
                  src="/competition.svg"
                  alt="Конкурсы"
                  width={18}
                  height={18}
                />
                Конкурсы
              </TabsTrigger>
            </TabsList>
          </div>

            {/* Кнопки создания по ролям */}
            {activeTab === "vacancies" && (
              <RoleGuard role="company">
                <div className="mb-4">
                  <Link href="/work/vacancy/create">
                    <Button className="rounded-[40px] gap-2">
                      <Plus className="w-4 h-4" />
                      Создать вакансию
                    </Button>
                  </Link>
                </div>
              </RoleGuard>
            )}
            {activeTab === "resumes" && (
              <RoleGuard role="specialist">
                <div className="mb-4">
                  <Link href="/work/resume/create">
                    <Button className="rounded-[40px] gap-2">
                      <Plus className="w-4 h-4" />
                      Создать резюме
                    </Button>
                  </Link>
                </div>
              </RoleGuard>
            )}
            {activeTab === "orders" && (
              <RoleGuard role="company">
                <div className="mb-4">
                  <Link href="/work/order/create">
                    <Button className="rounded-[40px] gap-2">
                      <Plus className="w-4 h-4" />
                      Создать заказ
                    </Button>
                  </Link>
                </div>
              </RoleGuard>
            )}
            {activeTab === "contests" && (
              <RoleGuard role="company">
                <div className="mb-4">
                  <Link href="/competitions/create">
                    <Button className="rounded-[40px] gap-2">
                      <Plus className="w-4 h-4" />
                      Создать конкурс
                    </Button>
                  </Link>
                </div>
              </RoleGuard>
            )}

            {renderContent()}
          </Tabs>
        </div>

        <div className="lg:col-span-1">{renderFilters()}</div>
      </div>
    </div>
  );
}

export default MainPage;
