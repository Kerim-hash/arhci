"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MyArticlesList } from "./MyArticlesList";
import { MyProjectsList } from "./MyProjectsList";
import { MyResumesList } from "./MyResumesList";
import { MyVacanciesList } from "./MyVacanciesList";

type ContentType = "articles" | "projects" | "resumes" | "vacancies";

const TABS: { id: ContentType; label: string }[] = [
  { id: "articles", label: "Статьи" },
  { id: "projects", label: "Проекты" },
  { id: "resumes", label: "Резюме" },
  { id: "vacancies", label: "Вакансии" },
];

export function MyArticlesSection() {
  const [activeTab, setActiveTab] = useState<ContentType>("articles");

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Мои статьи</h2>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ContentType)}>
        <TabsList className="gap-2 mb-6 flex-wrap justify-start bg-[#F5F5F7] p-1 rounded-[40px] h-auto">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="articles">
          <MyArticlesList />
        </TabsContent>
        <TabsContent value="projects">
          <MyProjectsList />
        </TabsContent>
        <TabsContent value="resumes">
          <MyResumesList />
        </TabsContent>
        <TabsContent value="vacancies">
          <MyVacanciesList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
