// app/specialists/architects/[slug]/page.tsx (обновленная версия с проектами)

"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Eye, Mail, MapPin, Plus, ThumbsUp, User } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { fetchProjectsBySpecialist } from "@/app/store/features/projectsSlice";
import ProjectCard from "@/app/projects/components/ProjectCard";
import { Button } from "@/components/ui/button";

export default function ArchitectPage() {
  const params = useParams();
  const slug = params.slug as string;
  const dispatch = useAppDispatch();

  const { specialists } = useAppSelector((state) => state.specialists);
  const { projects } = useAppSelector((state) => state.projects);
  const user = useAppSelector((state) => state.authSlice.user);

  const architect = specialists.find(
    (s) => s.category === "architects" && s.slug === slug,
  );

  // Проверяем, является ли текущий профиль профилем залогиненного пользователя
  const isOwnProfile = user?.specialistSlug === slug;

  useEffect(() => {
    if (architect) {
      dispatch(fetchProjectsBySpecialist(architect.id));
    }
  }, [dispatch, architect]);

  if (!architect) {
    notFound();
  }

  const contacts = {
    email: `${architect.slug}@example.com`,
    country: "Кыргызстан",
  };

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      {/* Хлебные крошки */}
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <Link href="/specialists/architects" className="hover:text-gray-700">
            Архитекторы
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{architect.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Левая колонка - информация об архитекторе */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <div className="flex flex-col gap-8 mb-6">
              <Image
                src={architect.avatar}
                width={80}
                height={80}
                alt={architect.name}
                className="object-cover w-20 h-20 rounded-full"
                priority
              />

              <div className="w-full md:w-2/3 text-[14px]">
                <h1 className="text-3xl md:text-2xl font-bold mb-2">
                  {architect.name}
                </h1>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#949494]">
                    <User width={14} />
                    {architect.categoryName}
                  </div>
                  <p>{architect.firm}</p>
                  {contacts && (
                    <div className="flex items-center gap-2 text-[#949494]">
                      <MapPin width={14} />
                      <span>{contacts.country}</span>
                    </div>
                  )}
                  {contacts && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#949494",
                        minWidth: 0,
                      }}
                    >
                      <Mail width={14} style={{ flexShrink: 0 }} />
                      <span
                        style={{
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {contacts.email}
                      </span>
                    </div>
                  )}
                  <Separator className="my-6 bg-[#333] h-0.5" />
                  <div className="flex justify-between items-center text-[14px]">
                    <p>Просмотры проектов</p>
                    <p>{architect.views || 0}</p>
                  </div>
                  <div className="flex justify-between items-center text-[14px]">
                    <p>Оценки</p>
                    <p>{architect.likes || 0}</p>
                  </div>
                  <div className="flex justify-between items-center text-[14px]">
                    <p>Рейтинг</p>
                    <p>{architect.rating || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Правая колонка - проекты */}
        <div className="lg:col-span-9">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Проекты</h2>
              <Link href={`/projects?specialist=${architect.id}`}>
                <button className="text-sm text-primary hover:underline">
                  Все проекты →
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ))}

              {/* Карточка «Создать проект» — только для своего профиля */}
              {isOwnProfile && (
                <Link href="/projects/create" className="block">
                  <div className="border-2 border-dashed border-[#E0E0E0] rounded-lg flex flex-col items-center justify-center min-h-[200px] hover:border-[#333] transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center mb-3">
                      <Plus className="w-5 h-5 text-[#333]" />
                    </div>
                    <span className="text-sm text-[#333] font-medium">Создать проект</span>
                  </div>
                </Link>
              )}
            </div>

            {projects.length === 0 && !isOwnProfile && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-[#666666]">
                  У этого специалиста пока нет проектов
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

