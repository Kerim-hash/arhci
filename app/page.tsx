import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import ArchitectureFirms from "@/components/architectureFirms";
import Link from "next/link";

const filters = ["Статьи", "Конкурсы", "Личности", "Объект"];

export default function Page() {
  return (
    <section className="container mx-auto relative px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Основной контент - занимает всю ширину на мобиле, 6 колонок на десктопе */}
        <div className="lg:col-span-6">
          <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-left mb-5">
            Первое архитектурное сообщество Кыргызстана
          </h1>
          <Separator className="bg-[#333333] mb-6 md:mb-10" />

          {/* Фильтры - адаптивное отображение */}
          <div className="flex flex-wrap gap-6 mb-4">
            {filters.map((item, i) => (
              <button
                key={item}
                className={cn(
                  "text-[16px] transition-colors cursor-pointer",
                  i === 0
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Карточки статей */}
          <div className="space-y-4 md:space-y-6">
            {[1, 2, 3].map((item) => (
              <Link href={`/articles/${item}`} key={item}>
                <Card key={item} className="overflow-hidden">
                  {/* Изображение - меняется пропорция на мобиле */}
                  <div className="relative aspect-video md:aspect-[2/5] overflow-hidden md:max-h-[320px] w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1523413651479-597eb2da0ad6"
                      alt="card image"
                      fill
                      className="object-cover w-full"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Бейдж */}
                    <Badge
                      variant="secondary"
                      className="absolute bottom-3 right-3 text-xs"
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
                      Тадао Андо (род. 1941) — японский архитектор-самоучка,
                      лауреат Притцкеровской премии 1995 года, чье творчество
                      относится к минимализму и критическому регионализму. Андо
                      известен своей почти религиозной работой с бетоном,
                      который в его руках приобретает идеальную, шелковистую
                      гладкость.
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Колонка новостей - скрывается на маленьких экранах, появляется на средних */}
        <div className="lg:col-span-3">
          <h3 className="text-xl md:text-[32px] font-medium mb-5 mt-8 md:mt-[170px]">
            Новости
          </h3>
          <Separator className="bg-[#333333] mb-6 md:mb-10" />

          <div className="space-y-4 md:space-y-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="p-4 md:p-6">
                <time
                  dateTime="2025-11-25"
                  className="text-sm font-medium text-muted-foreground block mb-2"
                >
                  25 ноября
                </time>
                <p className="text-sm md:text-[16px] text-[#333333] leading-relaxed line-clamp-4 md:line-clamp-6">
                  Мэрия Бишкека утвердила программу «Зеленый пояс»: Власти
                  начинают масштабную инвентаризацию и восстановление городских
                  парков и скверов с целью увеличения площади озеленения на 15%
                  к 2028 году.
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Архитектурные фирмы - скрывается на мобильных устройствах */}
        <div className="hidden lg:block lg:col-span-3">
          <ArchitectureFirms />
        </div>
      </div>
    </section>
  );
}
