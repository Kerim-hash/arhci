import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";

const Competitions = () => {
  return (
    <section className="container mx-auto relative px-4 sm:px-6 text-[#383838]">
      <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-left mb-5">
        Проект здания музей современного искусства г. Бишкек
      </h1>
      <Separator className="bg-[#333333] mb-6 md:mb-10" />
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mb-10">
        <Button size={"lg"} className="w-full sm:w-auto">
          Подать заявку
        </Button>
        <Button size={"lg"} variant={"outline"} className="w-full sm:w-auto">
          Скачать PDF
        </Button>
      </div>

      {/* Даты регистрации */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-1/2 bg-white p-4">
          <div className="flex flex-col sm:flex-row mb-4 sm:mb-6 gap-2 sm:gap-0">
            <div className="sm:flex-1 text-[#383838]">Начало регистрации:</div>
            <div className="sm:flex-1 font-semibold">8 января 2026</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <div className="sm:flex-1 text-[#383838]">Дедлайн регистрации:</div>
            <div className="sm:flex-1 font-semibold">26 мая 2026</div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-[#F5F5F7] p-4">
          <div className="flex flex-col sm:flex-row mb-4 sm:mb-6 gap-2 sm:gap-0">
            <div className="sm:flex-1 text-[#383838]">
              Дедлайн подачи проектов:
            </div>
            <div className="sm:flex-1 font-semibold">7 июня 2026</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <div className="sm:flex-1 text-[#383838]">
              Объявление результатов:
            </div>
            <div className="sm:flex-1 font-semibold">10 июля 2026</div>
          </div>
        </div>
      </div>

      {/* Детали конкурса */}
      <div className="bg-white p-4 sm:p-6 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(200px,328px)_1fr] gap-4 lg:gap-y-5">
          <div className="text-[#383838]">Открыт для</div>
          <div className="flex gap-4 flex-wrap">
            <Badge>Профессионалы</Badge>
            <Badge>Студенты</Badge>
          </div>

          <div className="text-[#383838]">Страна</div>
          <div className="font-semibold">Кыргызстан</div>

          <div className="text-[#383838]">Город</div>
          <div className="font-semibold">Бишкек</div>

          <div className="text-[#383838]">Регистрационный взнос</div>
          <div className="font-semibold">Да (60)€</div>

          <div className="text-[#383838]">Награда</div>
          <div className="font-semibold">грант $100 000</div>

          <div className="text-[#383838]">Организатор</div>
          <div className="font-semibold">Baihouse</div>
        </div>
      </div>

      <p className="italic mt-6 underline text-[16px] text-center lg:text-left">
        Страничка премии на сайте Гарвардского университета
      </p>

      {/* О конкурсе */}
      <div className="mt-10 lg:mt-20">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          <div className="w-full lg:w-auto mx-auto lg:mx-0">
            <Image
              src="/frame.png"
              alt="frame"
              width={328}
              height={328}
              className="w-full max-w-[328px] h-auto mx-auto lg:mx-0"
            />
          </div>
          <div className="lg:flex-1">
            <h6 className="font-semibold mb-4 lg:mb-6 text-lg lg:text-base">
              О конкурсе
            </h6>
            <p className="text-sm lg:text-base">
              Объявляется международный архитектурный конкурс, посвящённый
              разработке архитектурного проекта в городе Бишкек. Конкурс
              направлен на поиск сильных концептуальных и реализуемых
              архитектурных решений, способных ответить на современные
              социальные, культурные и пространственные вызовы региона. К
              участию приглашаются архитекторы и студенты со всего мира. Конкурс
              предоставляет уникальную возможность не только получить
              международное признание, но и реализовать проект, а также пройти
              стажировку в ведущих мировых архитектурных бюро.
            </p>
          </div>
        </div>

        {/* Задача конкурса */}
        <p className="font-semibold mt-8 lg:mt-10 text-lg lg:text-base">
          Задача конкурса
        </p>
        <p className="mt-4 lg:mt-6 mb-2 text-sm lg:text-base">
          Участникам предлагается разработать архитектурную концепцию,
          отражающую:
        </p>
        <div className="space-y-4 lg:space-y-6">
          <ul className="space-y-2 lg:space-y-3 list-disc pl-5 text-sm lg:text-base">
            <li>Уважение к локальному контексту и культуре;</li>
            <li>Современное архитектурное мышление;</li>
            <li>Функциональность и пространственную логику;</li>
            <li>Потенциал для реализации.</li>
          </ul>

          <div className="text-sm lg:text-base">
            Проект должен продемонстрировать целостную архитектурную идею, ясную
            структуру и аргументированный подход к выбранным решениям.
          </div>
        </div>

        {/* Условия участия */}
        <p className="font-semibold mt-8 lg:mt-10 mb-4 lg:mb-6 text-lg lg:text-base">
          Условия участия
        </p>
        <div className="space-y-4 lg:space-y-6">
          <ul className="space-y-2 lg:space-y-3 list-disc pl-5 text-sm lg:text-base">
            <li>Конкурс открыт для профессионалов и студентов.</li>
            <li>Допускается индивидуальное и командное участие.</li>
            <li>Регистрация открыта с 8 января 2026 года.</li>
            <li>
              Участие платное, регистрационный взнос — от 60 до 120 € (в
              зависимости от этапа регистрации).
            </li>
          </ul>
        </div>

        {/* Состав конкурсного проекта */}
        <p className="font-semibold mt-8 lg:mt-10 mb-4 lg:mb-6 text-lg lg:text-base">
          Состав конкурсного проекта
        </p>
        <div className="space-y-4 lg:space-y-6">
          <ul className="space-y-2 lg:space-y-3 list-disc pl-5 text-sm lg:text-base">
            <li>
              Проект подаётся в цифровом формате и должен включать:
              <ul className="space-y-2 lg:space-y-3 list-disc pl-5 mt-2 lg:mt-3 text-sm lg:text-base">
                <li>концептуальное описание проекта;</li>
                <li>архитектурную идею и ключевые принципы;</li>
                <li>планы, фасады и разрезы (по необходимости);</li>
                <li>визуализации или схемы, раскрывающие проект;</li>
                <li>логичную и понятную подачу материалов.</li>
              </ul>
            </li>
            <li>
              Точные технические требования и формат файлов предоставляются
              после регистрации.
            </li>
          </ul>
        </div>

        {/* Критерии оценки */}
        <p className="font-semibold mt-8 lg:mt-10 mb-4 lg:mb-6 text-lg lg:text-base">
          Критерии оценки
        </p>
        <div className="space-y-4 lg:space-y-6">
          <ul className="space-y-2 lg:space-y-3 list-disc pl-5 text-sm lg:text-base">
            <li>
              Проекты оцениваются по следующим критериям:
              <ul className="space-y-2 lg:space-y-3 list-disc pl-5 mt-2 lg:mt-3 text-sm lg:text-base">
                <li>архитектурное качество и оригинальность;</li>
                <li>соответствие теме и контексту конкурса;</li>
                <li>пространственная и функциональная логика;</li>
                <li>потенциал реализации.</li>
                <li>общее качество презентации.</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Competitions;
