// components/MainPage.tsx (упрощенный вариант)
"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VacanciesList } from "./components/VacanciesList";
import { OrdersList } from "./components/OrdersList";
import { ContestsList } from "./components/ContestsList";
import { ResumesList } from "./components/ResumesList";
import { FiltersSidebar } from "./components/FiltersSidebar";
import { OrderFiltersSidebar } from "./components/OrderFiltersSidebar";
import { ResumeFiltersSidebar } from "./components/ResumeFiltersSidebar";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { setActiveTab } from "@/app/store/features/appSlice";
import { Button } from "@/components/ui/button";
import { RoleGuard } from "@/components/RoleGuard";
import { Plus } from "lucide-react";

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

  const renderFilters = () => {
    switch (activeTab) {
      case "vacancies":
        return <FiltersSidebar />;
      case "orders":
        return <OrderFiltersSidebar />;
      case "resumes":
        return <ResumeFiltersSidebar />;
      default:
        return <FiltersSidebar />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid gap-5 w-fit grid-cols-4 mb-6">
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
            {activeTab === "contests" && (
              <RoleGuard role="company">
                <div className="mb-4">
                  <Link href="/work/competitions/create">
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
