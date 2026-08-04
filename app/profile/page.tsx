"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LayoutGrid, MessageSquareText, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetProfileQuery } from "@/app/store/features/authApi";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { MyPortfolioGrid } from "./components/MyPortfolioGrid";
import { MyOrdersTab } from "./components/MyOrdersTab";
import { MyResponsesTab } from "./components/MyResponsesTab";
import { MyResumeTab } from "./components/MyResumeTab";
import { MyArticlesSection } from "./components/MyArticlesSection";
import { MyContestsTab } from "./components/MyContestsTab";

type TabType = "portfolio" | "orders" | "responses" | "resume" | "articles" | "contests";

const Profile = () => {
  const router = useRouter();
  const { data: user, isLoading, isError } = useGetProfileQuery();
  const [activeTab, setActiveTab] = useState<TabType>("portfolio");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (!token || isError) {
      router.push("/auth/login");
    }
  }, [isError, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || (typeof window !== "undefined" && !localStorage.getItem("access_token"))) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Левая панель */}
        <div className="md:w-75 shrink-0">
          <ProfileSidebar user={user} />
        </div>

        {/* Правая панель */}
        <div className="flex-1 min-w-0">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)}>
            <div className="w-full overflow-x-auto pb-1 mb-6 scrollbar-none">
              <TabsList className="gap-2 w-max bg-[#F5F5F7] p-1 rounded-[40px] h-auto">
                <TabsTrigger value="portfolio" className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" />
                  Портфолио
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Image src="/list.svg" alt="" width={16} height={16} />
                  Мои заказы
                </TabsTrigger>
                <TabsTrigger value="responses" className="flex items-center gap-2">
                  <MessageSquareText className="w-4 h-4" />
                  Мои отклики
                </TabsTrigger>
                <TabsTrigger value="resume" className="flex items-center gap-2">
                  <Image src="/file-vacan.svg" alt="" width={16} height={16} />
                  Мое резюме
                </TabsTrigger>
                <TabsTrigger value="articles" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Мои статьи
                </TabsTrigger>
                <TabsTrigger value="contests" className="flex items-center gap-2">
                  <Image src="/competition.svg" alt="" width={16} height={16} />
                  Конкурсы
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="portfolio">
              <MyPortfolioGrid />
            </TabsContent>
            <TabsContent value="orders">
              <MyOrdersTab />
            </TabsContent>
            <TabsContent value="responses">
              <MyResponsesTab />
            </TabsContent>
            <TabsContent value="resume">
              <MyResumeTab />
            </TabsContent>
            <TabsContent value="articles">
              <MyArticlesSection />
            </TabsContent>
            <TabsContent value="contests">
              <MyContestsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
