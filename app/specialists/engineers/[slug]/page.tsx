// app/specialists/engineers/[slug]/page.tsx

"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Mail, MapPin, User } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { fetchProjectsBySpecialist } from "@/app/store/features/projectsSlice";
import ProjectCard from "@/app/projects/components/ProjectCard";

export default function EngineerPage() {
  const params = useParams();
  const slug = params.slug as string;
  const dispatch = useAppDispatch();

  const { specialists } = useAppSelector((state) => state.specialists);
  const { projects } = useAppSelector((state) => state.projects);

  const engineer = specialists.find(
    (s) => s.category === "engineers" && s.slug === slug,
  );

  useEffect(() => {
    if (engineer) {
      dispatch(fetchProjectsBySpecialist(engineer.id));
    }
  }, [dispatch, engineer]);

  if (!engineer) {
    notFound();
  }

  const contacts = {
    email: `${engineer.slug}@example.com`,
    country: "Кыргызстан",
  };

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <Link href="/specialists/engineers" className="hover:text-gray-700">
            Инженеры
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{engineer.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <div className="flex flex-col gap-8 mb-6">
              <Image
                src={engineer.avatar}
                width={80}
                height={80}
                alt={engineer.name}
                className="object-cover w-20 h-20 rounded-full"
                priority
              />

              <div className="w-full md:w-2/3 text-[14px]">
                <h1 className="text-3xl md:text-2xl font-bold mb-2">
                  {engineer.name}
                </h1>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#949494]">
                    <User width={14} />
                    {engineer.categoryName}
                  </div>
                  <p>{engineer.firm}</p>
                  {contacts && (
                    <div className="flex items-center gap-2 text-[#949494]">
                      <MapPin width={14} />
                      <span>{contacts.country}</span>
                    </div>
                  )}
                  {contacts && (
                    <div className="flex items-center gap-2 text-[#949494]">
                      <Mail width={14} />
                      <span>{contacts.email}</span>
                    </div>
                  )}
                  <Separator className="my-6 bg-[#333] h-0.5" />
                  <div className="flex justify-between items-center text-[14px]">
                    <p>Просмотры</p>
                    <p>{engineer.views || 0}</p>
                  </div>
                  <div className="flex justify-between items-center text-[14px]">
                    <p>Оценки</p>
                    <p>{engineer.likes || 0}</p>
                  </div>
                  <div className="flex justify-between items-center text-[14px]">
                    <p>Рейтинг</p>
                    <p>{engineer.rating || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-9">
          <div>
            <h2 className="text-2xl font-bold mb-4">Об инженере</h2>
            <p className="text-[#666666] mb-8 leading-relaxed">
              {engineer.description}
            </p>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Проекты</h2>
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
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
