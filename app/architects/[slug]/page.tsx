import { notFound } from "next/navigation";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Architect {
  id: number;
  slug: string;
  name: string;
  firm: string;
  avatar: string;
  position: string;
  projects: Array<{
    id: number;
    title: string;
    description: string;
    image: string;
    year: number;
  }>;
  contacts?: {
    email?: string;
    country?: string;
  };
}

// Пример данных
const architectsData: Architect[] = [
  {
    id: 1,
    slug: "abdullaev-temirlan",
    name: "Абдуллаев Темирлан",
    firm: "ARCHIDOM",
    avatar: "/avatar.png",
    position: "Основатель и главный архитектор",
    projects: [
      {
        id: 1,
        title: "Жилой комплекс «Эдельвейс»",
        description:
          "Современный жилой комплекс с элементами национальной архитектуры. 12 этажей, 120 квартир, подземный паркинг.",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
        year: 2023,
      },
      {
        id: 2,
        title: "Бизнес-центр «Ала-Тоо»",
        description:
          "Многофункциональный бизнес-центр класса А с офисными помещениями, конференц-залами и кафе.",
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
        year: 2021,
      },
      {
        id: 3,
        title: "Частная школа «Сапат»",
        description:
          "Образовательный комплекс с современными классами, лабораториями и спортивными площадками.",
        image: "https://images.unsplash.com/photo-1562774053-701939374585",
        year: 2020,
      },
    ],
    contacts: {
      email: "temirlan@archidom.kg",
      country: "Кыргызстан",
    },
  },
  {
    id: 2,
    slug: "ivanova-mariya",
    name: "Иванова Мария",
    firm: "Urban Design Studio",
    avatar: "/avatar2.png",
    position: "Ведущий архитектор",
    projects: [
      {
        id: 4,
        title: "Культурный центр «Азия»",
        description:
          "Многофункциональный культурный центр с концертным залом, выставочными пространствами и библиотекой.",
        image: "https://images.unsplash.com/photo-1583160247711-2191776b4b91",
        year: 2022,
      },
      {
        id: 5,
        title: "Набережная реки Чуй",
        description:
          "Благоустройство набережной с пешеходными дорожками, велодорожками и зонами отдыха.",
        image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90",
        year: 2021,
      },
      {
        id: 6,
        title: "Отель «Панфилов»",
        description:
          "Пятизвездочный отель с ресторанами, спа-центром и конференц-залами.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        year: 2020,
      },
    ],
    contacts: {
      email: "maria@uds.kg",
      country: "Кыргызстан",
    },
  },
  {
    id: 3,
    slug: "smith-john",
    name: "Смит Джон",
    firm: "International Architects",
    avatar: "/avatar3.png",
    position: "Главный архитектор",
    projects: [
      {
        id: 7,
        title: "Аэропорт «Манас» Терминал 2",
        description:
          "Модернизация международного терминала с увеличенной пропускной способностью и современными технологиями.",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
        year: 2023,
      },
      {
        id: 8,
        title: "Университетский кампус",
        description:
          "Современный университетский кампус с лабораториями, общежитиями и спортивным комплексом.",
        image: "https://images.unsplash.com/photo-1562774053-701939374585",
        year: 2022,
      },
      {
        id: 9,
        title: "Торговый центр «Бишкек Парк»",
        description:
          "Крупнейший торгово-развлекательный центр города с кинотеатром и фуд-кортом.",
        image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
        year: 2021,
      },
    ],
    contacts: {
      email: "john@intarch.com",
      country: "США",
    },
  },
  {
    id: 4,
    slug: "abdullaeva-aijan",
    name: "Абдуллаева Айжан",
    firm: "Eco Architecture",
    avatar: "/avatar4.png",
    position: "Ландшафтный архитектор",
    projects: [
      {
        id: 10,
        title: "Городской парк «Дубовый»",
        description:
          "Экопарк с зонами для пикников, детскими площадками и велодорожками.",
        image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
        year: 2023,
      },
      {
        id: 11,
        title: "ЖК «ЭкоГород»",
        description:
          "Экологичный жилой комплекс с системой сбора дождевой воды и солнечными панелями.",
        image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90",
        year: 2022,
      },
      {
        id: 12,
        title: "Ботанический сад",
        description:
          "Реконструкция ботанического сада с оранжереями и образовательным центром.",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b",
        year: 2021,
      },
    ],
    contacts: {
      email: "aijan@ecoarch.kg",
      country: "Кыргызстан",
    },
  },
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const architect = architectsData.find((a) => a.slug === slug);

  if (!architect) {
    return {
      title: "Архитектор не найден",
    };
  }

  return {
    title: `${architect.name} | Архитекторы`,
    description: architect.position,
  };
}

export default async function ArchitectPage({ params }: PageProps) {
  const { slug } = await params;
  const architect = architectsData.find((a) => a.slug === slug);

  if (!architect) {
    notFound();
  }

  return (
    <section className="container mx-auto relative px-4 sm:px-6 py-8">
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <Link href="/architects" className="hover:text-gray-700">
            Архитекторы
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{architect.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Аватар */}
            <div className="w-full md:w-1/3">
              <div className="w-82 h-82 md:w-full  mx-auto">
                <Image
                  src={architect.avatar}
                  width={400}
                  height={400}
                  alt={architect.name}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>

            {/* Основная информация */}
            <div className="w-full md:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {architect.name}
              </h1>
              <Separator className="my-6 bg-[#333] h-0.5" />
              <div className="space-y-3">
                {architect.contacts && (
                  <div className="flex flex-col ">
                    <span className="w-8 text-gray-500">Страна</span>
                    <span>{architect.contacts.country}</span>
                  </div>
                )}
                {architect.contacts && (
                  <div className="flex flex-col ">
                    <span className="w-8 text-gray-500">Email:</span>
                    <span>{architect.contacts.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Детальная информация */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Проекты</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {architect.projects.map((project) => (
                <div
                  key={project.id}
                  className="overflow-hidden transition-shadow"
                >
                  <div className="relative aspect-[4/2] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Сайдбар */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            {/* Другие архитекторы - компактно 3 в ряд */}
            <Card className="p-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Поиск..." className="pl-10" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-3">архитекторы</h3>
              <div className="flex justify-between">
                {architectsData
                  .filter((a) => a.slug !== slug)
                  .slice(0, 3)
                  .map((other) => (
                    <Link
                      key={other.id}
                      href={`/architects/${other.slug}`}
                      className="flex flex-col items-center w-20"
                    >
                      <div className="w-20.5 h-27.75  overflow-hidden mb-1">
                        <Image
                          src={other.avatar}
                          width={48}
                          height={48}
                          alt={other.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

// Генерация статических параметров для SSG
export async function generateStaticParams() {
  return architectsData.map((architect) => ({
    slug: architect.slug,
  }));
}
