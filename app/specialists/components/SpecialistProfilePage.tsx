"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Plus, User } from "lucide-react";

import ProjectCard from "@/app/projects/components/ProjectCard";
import { useAppSelector } from "@/app/store/hooks";
import LikeButton from "@/components/LikeButton";
import { Separator } from "@/components/ui/separator";
import { isNotFound } from "@/lib/isNotFound";
import { findSpecialty, type Specialty } from "@/lib/specialties";
import {
  useApiProjectsSpecialistListQuery,
  useApiSpecialistsRetrieveQuery,
  useApiSpecialistsViewsCreateMutation,
  type PaginatedProjectListListRead,
  type SpecialistDetailRead,
} from "@/services/generatedApi";

// regionFrom приходит списком регионов; собираем в одну строку
const formatLocation = (regionFrom: unknown): string =>
  Array.isArray(regionFrom)
    ? regionFrom
        .filter((region): region is string => typeof region === "string" && region.trim() !== "")
        .join(", ")
    : "";

interface SpecialistProfilePageProps {
  slug: string;
  /** Категория из адреса — для подписей, пока профиль не загружен. */
  specialty: Specialty;
  /** Профиль и его проекты с сервера (анонимный запрос). */
  initialSpecialist?: SpecialistDetailRead;
  initialProjects?: PaginatedProjectListListRead;
}

export default function SpecialistProfilePage({
  slug,
  specialty: urlSpecialty,
  initialSpecialist,
  initialProjects,
}: SpecialistProfilePageProps) {
  const profileQuery = useApiSpecialistsRetrieveQuery({ slug }, { skip: !slug });
  // Серверная копия не показывается, если API уже ответил, что профиля нет
  const specialist =
    profileQuery.data ?? (isNotFound(profileQuery.error) ? undefined : initialSpecialist);
  const [incrementViews] = useApiSpecialistsViewsCreateMutation();
  const user = useAppSelector((state) => state.authSlice.user);

  // Считаем просмотр один раз на загруженный профиль, а не на каждый рефетч
  const loadedId = specialist?.id;
  useEffect(() => {
    if (loadedId !== undefined) {
      incrementViews({ id: loadedId });
    }
  }, [loadedId, incrementViews]);

  const projectsQuery = useApiProjectsSpecialistListQuery(
    { specialistId: loadedId ?? 0 },
    { skip: loadedId === undefined },
  );
  const projects = (projectsQuery.data ?? initialProjects)?.results ?? [];

  if (!specialist) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-8">
        <div className="text-center py-12">
          {profileQuery.isError ? "Специалист не найден" : "Загрузка..."}
        </div>
      </section>
    );
  }

  // Подписи — по настоящей категории профиля, а не по адресу, с которого пришли
  const specialty = findSpecialty(specialist.category) ?? urlSpecialty;
  const isOwnProfile = user?.specialistSlug === slug;
  // Показываем только то, что специалист действительно указал — без выдуманных контактов
  const email = specialist.email || "";
  const location = formatLocation(specialist.regionFrom);

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/specialists/${specialty.id}`} className="hover:text-gray-700">
            {specialty.plural}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{specialist.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <div className="flex flex-col gap-8 mb-6">
              <Image
                src={specialist.avatar || "/user.svg"}
                width={80}
                height={80}
                alt={specialist.name}
                className={`w-20 h-20 rounded-full ${specialist.avatar ? "object-cover" : "object-none"}`}
                priority
              />

              <div className="w-full md:w-2/3 text-[14px]">
                <h1 className="text-3xl md:text-2xl font-bold mb-2">{specialist.name}</h1>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#949494]">
                    <User width={14} />
                    {specialist.categoryName || specialty.label}
                  </div>
                  <p>{specialist.firm || ""}</p>
                  {location && (
                    <div className="flex items-center gap-2 text-[#949494]">
                      <MapPin width={14} />
                      <span>{location}</span>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-2 text-[#949494] min-w-0">
                      <Mail width={14} className="shrink-0" />
                      <span className="truncate">{email}</span>
                    </div>
                  )}
                  <Separator className="my-6 bg-[#333] h-0.5" />
                  <div className="flex justify-between items-center text-[14px]">
                    <p>Просмотры</p>
                    <p>{specialist.views || 0}</p>
                  </div>
                  <div className="flex justify-between items-center text-[14px]">
                    <p>Оценки</p>
                    <p>{specialist.likes || 0}</p>
                  </div>
                  <div className="flex justify-between items-center text-[14px]">
                    <p>Рейтинг</p>
                    <p>{specialist.rating || 0}</p>
                  </div>
                  <LikeButton
                    target="specialist"
                    targetId={specialist.id}
                    initialLikes={specialist.likes || 0}
                    initialIsLiked={specialist.isLiked}
                    className="w-full mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-9">
          {specialist.description && (
            <>
              <h2 className="text-2xl font-bold mb-4">{specialty.about}</h2>
              <p className="text-[#666666] mb-8 leading-relaxed">{specialist.description}</p>
            </>
          )}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{specialty.works}</h2>
            {projects.length > 0 && (
              <Link
                href={`/projects?specialist=${specialist.id}`}
                className="text-sm text-primary hover:underline"
              >
                Все проекты →
              </Link>
            )}
          </div>

          {projects.length > 0 || isOwnProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} category={specialty.id} />
              ))}

              {/* Карточка «Создать проект» — только в своём профиле */}
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
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-[#666666]">{specialty.noWorks}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
