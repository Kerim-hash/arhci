// app/competitions/[slug]/page.tsx
"use client";

import { useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchCompetitionBySlug, incrementCompetitionViews, clearCurrentCompetition } from "@/app/store/features/competitionsSlice";
import { Competition } from "@/types/competition";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Eye, Award, Building2, CreditCard, Globe } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";

export default function CompetitionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const dispatch = useAppDispatch();
  const { currentCompetition, loading, error } = useAppSelector((state) => state.competitions);

  useEffect(() => {
    if (slug) {
      dispatch(fetchCompetitionBySlug(slug)).then((action) => {
        const competition = action.payload as Competition | undefined;
        if (competition?.id) {
          dispatch(incrementCompetitionViews(competition.id));
        }
      });
    }

    return () => {
      dispatch(clearCurrentCompetition());
    };
  }, [dispatch, slug]);

  if (error) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-8">
        <div className="text-center py-12 text-red-500">Ошибка: {error}</div>
      </section>
    );
  }

  if (loading || !currentCompetition) {
    return (
      <section className="container mx-auto relative px-4 sm:px-6 py-8">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="text-[#666666] mt-4">Загрузка конкурса...</p>
        </div>
      </section>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      {/* Навигация */}
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">Главная</Link>
          <span className="mx-2">/</span>
          <Link href="/competitions" className="hover:text-gray-700">Конкурсы</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{currentCompetition.title}</span>
        </nav>
      </div>

      {/* Заголовок */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-left mb-4">
          {currentCompetition.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#666666] mb-6">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Дедлайн: {formatDate(currentCompetition.dates.submissionDeadline)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{currentCompetition.participantsCount} участников</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{currentCompetition.views} просмотров</span>
          </div>
          <Badge className={currentCompetition.isActive ? "bg-green-500" : "bg-gray-500"}>
            {currentCompetition.isActive ? "Активный" : "Завершен"}
          </Badge>
        </div>
      </div>
      
      <Separator className="bg-[#333333] mb-6" />

      {/* Кнопки действий */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mb-10">
        <RoleGuard role="specialist">
          <Button size="lg" className="w-full sm:w-auto">
            Подать заявку
          </Button>
        </RoleGuard>
        <Button size="lg" variant="outline" className="w-full sm:w-auto">
          Скачать PDF
        </Button>
      </div>

      {/* Даты регистрации */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="w-full lg:w-1/2 bg-white border rounded-lg p-4">
          <div className="flex flex-col sm:flex-row mb-4 sm:mb-6 gap-2 sm:gap-0">
            <div className="sm:flex-1 text-[#383838]">Начало регистрации:</div>
            <div className="sm:flex-1 font-semibold">{formatDate(currentCompetition.dates.startRegistration)}</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <div className="sm:flex-1 text-[#383838]">Дедлайн регистрации:</div>
            <div className="sm:flex-1 font-semibold">{formatDate(currentCompetition.dates.endRegistration)}</div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-[#F5F5F7] rounded-lg p-4">
          <div className="flex flex-col sm:flex-row mb-4 sm:mb-6 gap-2 sm:gap-0">
            <div className="sm:flex-1 text-[#383838]">Дедлайн подачи проектов:</div>
            <div className="sm:flex-1 font-semibold">{formatDate(currentCompetition.dates.submissionDeadline)}</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <div className="sm:flex-1 text-[#383838]">Объявление результатов:</div>
            <div className="sm:flex-1 font-semibold">{formatDate(currentCompetition.dates.resultsAnnouncement)}</div>
          </div>
        </div>
      </div>

      {/* Детали конкурса */}
      <div className="bg-white border rounded-lg p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-y-5">
          <div>
            <div className="text-[#383838] text-sm mb-1">Открыт для</div>
            <div className="flex gap-2 flex-wrap">
              {currentCompetition.openFor.map((item) => (
                <Badge key={item} variant="secondary">{item}</Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[#383838] text-sm mb-1">Страна</div>
            <div className="font-semibold">{currentCompetition.country}</div>
          </div>

          <div>
            <div className="text-[#383838] text-sm mb-1">Город</div>
            <div className="font-semibold">{currentCompetition.city}</div>
          </div>

          <div>
            <div className="text-[#383838] text-sm mb-1">Регистрационный взнос</div>
            <div className="font-semibold">{currentCompetition.registrationFee}</div>
          </div>

          <div>
            <div className="text-[#383838] text-sm mb-1">Награда</div>
            <div className="font-semibold text-green-600">{currentCompetition.prize}</div>
          </div>

          <div>
            <div className="text-[#383838] text-sm mb-1">Организатор</div>
            <div className="font-semibold">{currentCompetition.organizer}</div>
          </div>
        </div>
      </div>

      {currentCompetition.organizerLink && (
        <p className="italic mb-6 underline text-[16px] text-center lg:text-left">
          <a href={currentCompetition.organizerLink} target="_blank" rel="noopener noreferrer">
            Страничка конкурса на сайте {currentCompetition.organizer}
          </a>
        </p>
      )}

      {/* О конкурсе */}
      <div className="mt-10 lg:mt-20">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mb-8">
          <div className="w-full lg:w-auto mx-auto lg:mx-0">
            <img
              src={currentCompetition.image}
              alt={currentCompetition.title}
              className="w-full max-w-[328px] h-auto mx-auto lg:mx-0 rounded-lg"
            />
          </div>
          <div className="lg:flex-1">
            <h2 className="font-semibold mb-4 text-xl">О конкурсе</h2>
            <p className="text-sm lg:text-base leading-relaxed">
              {currentCompetition.description}
            </p>
          </div>
        </div>

        {/* Задача конкурса */}
        <h2 className="font-semibold mt-8 text-xl mb-4">Задача конкурса</h2>
        <p className="mb-4 text-sm lg:text-base">Участникам предлагается разработать архитектурную концепцию, отражающую:</p>
        <ul className="space-y-2 list-disc pl-5 text-sm lg:text-base mb-6">
          {currentCompetition.tasks.map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>

        {/* Условия участия */}
        <h2 className="font-semibold mt-8 text-xl mb-4">Условия участия</h2>
        <ul className="space-y-2 list-disc pl-5 text-sm lg:text-base mb-6">
          {currentCompetition.conditions.map((condition, index) => (
            <li key={index}>{condition}</li>
          ))}
        </ul>

        {/* Состав конкурсного проекта */}
        <h2 className="font-semibold mt-8 text-xl mb-4">Состав конкурсного проекта</h2>
        <ul className="space-y-2 list-disc pl-5 text-sm lg:text-base mb-6">
          <li>
            Проект подаётся в цифровом формате и должен включать:
            <ul className="space-y-2 list-disc pl-5 mt-2">
              {currentCompetition.projectComposition.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </li>
        </ul>

        {/* Критерии оценки */}
        <h2 className="font-semibold mt-8 text-xl mb-4">Критерии оценки</h2>
        <ul className="space-y-2 list-disc pl-5 text-sm lg:text-base">
          <li>
            Проекты оцениваются по следующим критериям:
            <ul className="space-y-2 list-disc pl-5 mt-2">
              {currentCompetition.evaluationCriteria.map((criteria, index) => (
                <li key={index}>{criteria}</li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </section>
  );
}