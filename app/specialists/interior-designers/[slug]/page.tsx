// app/specialists/interior-designers/[slug]/page.tsx

"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Mail, MapPin, User } from "lucide-react";
import {
  useApiSpecialistsRetrieveQuery,
  useApiProjectsSpecialistListQuery,
  useApiSpecialistsViewsCreateMutation,
} from "@/services/generatedApi";
import ProjectCard from "@/app/projects/components/ProjectCard";
import LikeButton from "@/components/LikeButton";

// regionFrom приходит списком регионов; собираем в одну строку
const formatLocation = (regionFrom: unknown): string =>
  Array.isArray(regionFrom)
    ? regionFrom.filter((region): region is string => typeof region === "string" && region.trim() !== "").join(", ")
    : "";

export default function InteriorDesignerPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: designer, isLoading } = useApiSpecialistsRetrieveQuery(
    { slug },
    { skip: !slug }
  );
  const [incrementViews] = useApiSpecialistsViewsCreateMutation();

  // Считаем просмотр один раз на загруженный профиль, а не на каждый рефетч
  const loadedId = designer?.id;
  useEffect(() => {
    if (loadedId !== undefined) {
      incrementViews({ id: loadedId });
    }
  }, [loadedId, incrementViews]);

  const { data: projectsData } = useApiProjectsSpecialistListQuery(
    { specialistId: designer?.id || 0 },
    { skip: !designer?.id }
  );
  const projects = projectsData?.results || [];

  if (isLoading || !designer) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-8">
        <div className="text-center py-12">Загрузка...</div>
      </section>
    );
  }

  // Показываем только то, что специалист действительно указал — без выдуманных контактов
  const contacts = {
    email: designer.email || "",
    location: formatLocation(designer.regionFrom),
  };

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/specialists/interior-designers"
            className="hover:text-gray-700"
          >
            Дизайнеры интерьера
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{designer.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <div className="flex flex-col gap-8 mb-6">
              <Image
                src={designer.avatar || '/user.svg'}
                width={80}
                height={80}
                alt={designer.name}
                className={`w-20 h-20 rounded-full ${designer.avatar ? 'object-cover' : 'object-none'}`}
                priority
              />

              <div className="w-full md:w-2/3 text-[14px]">
                <h1 className="text-3xl md:text-2xl font-bold mb-2">
                  {designer.name}
                </h1>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#949494]">
                    <User width={14} />
                    {designer.categoryName || designer.category || ''}
                  </div>
                  <p>{designer.firm || ''}</p>
                  {contacts.location && (
                    <div className="flex items-center gap-2 text-[#949494]">
                      <MapPin width={14} />
                      <span>{contacts.location}</span>
                    </div>
                  )}
                  {contacts.email && (
                    <div className="flex items-center gap-2 text-[#949494]">
                      <Mail width={14} />
                      <span>{contacts.email}</span>
                    </div>
                  )}
                  <Separator className="my-6 bg-[#333] h-0.5" />
                  <div className="flex justify-between items-center text-[14px]">
                    <p>Просмотры</p>
                    <p>{designer.views || 0}</p>
                  </div>
                  <div className="flex justify-between items-center text-[14px]">
                    <p>Оценки</p>
                    <p>{designer.likes || 0}</p>
                  </div>
                  <div className="flex justify-between items-center text-[14px]">
                    <p>Рейтинг</p>
                    <p>{designer.rating || 0}</p>
                  </div>
                  <LikeButton
                    target="specialist"
                    targetId={designer.id}
                    initialLikes={designer.likes || 0}
                    initialIsLiked={designer.isLiked}
                    className="w-full mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-9">
          <div>
            <h2 className="text-2xl font-bold mb-4">О дизайнере</h2>
            <p className="text-[#666666] mb-8 leading-relaxed">
              {designer.description}
            </p>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Проекты</h2>
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} category="interior-designers" />
                ))}
              </div>
            ) : (
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
