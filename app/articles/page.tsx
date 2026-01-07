import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Article = () => {
  return (
    <section className="container mx-auto relative px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-left mb-5">
            Статьи
          </h1>
          <Separator className="bg-[#333333] mb-6 md:mb-10" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {[1, 2, 3].map((item, index) => (
          <Card key={item} className="overflow-hidden">
            {/* Изображение - меняется пропорция на мобиле */}
            <div className="relative aspect-video md:aspect-[2/5] overflow-hidden md:max-h-[320px] w-full">
              <Image
                src={`/article-${index}.png`}
                alt="card image"
                fill
                className="object-cover w-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Бейдж */}
              <Badge
                variant="secondary"
                className="absolute bottom-3 right-3 text-[16px] px-7"
              >
                Личности
              </Badge>
            </div>

            {/* Контент карточки */}
            <div className="p-4 md:p-6">
              <h2 className="text-lg sm:text-xl md:text-[32px] font-medium leading-tight underline mb-3">
                Тадао Андо: Геометрия, Свет и Поэзия Бетона
              </h2>

              <p className="text-sm md:text-[16px] text-[#6D6D6D] leading-relaxed line-clamp-3 md:line-clamp-4">
                Тадао Андо (род. 1941) — японский архитектор-самоучка, лауреат
                Притцкеровской премии 1995 года, чье творчество относится к
                минимализму и критическому регионализму. Андо известен своей
                почти религиозной работой с бетоном, который в его руках
                приобретает идеальную, шелковистую гладкость.
              </p>
            </div>
            <Link
              href={`/articles/${item}`}
              key={item}
              className="ml-auto block font-medium text-[18px]"
            >
              Читать далее
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Article;
