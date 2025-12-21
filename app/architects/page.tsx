import ArchitectureFirms from "@/components/architectureFirms";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

// Типизация данных
interface Architect {
  id: number;
  slug: string;
  name: string;
  firm: string;
  avatar: string;
  description: string;
}

// Пример данных (в реальном проекте получайте из API или БД)
const architects: Architect[] = [
  {
    id: 1,
    slug: "abdullaev-temirlan",
    name: "Абдуллаев Темирлан",
    firm: "ARCHIDOM",
    avatar: "/avatar.png",
    description: "Основатель архитектурного бюро ARCHIDOM",
  },
  {
    id: 2,
    slug: "ivanova-mariya",
    name: "Иванова Мария",
    firm: "Urban Design Studio",
    avatar: "/avatar2.png",
    description: "Главный архитектор Urban Design Studio",
  },
  {
    id: 3,
    slug: "smith-john",
    name: "Смит Джон",
    firm: "Urban Design Studio",
    avatar: "/avatar3.png",
    description: "Главный архитектор Urban Design Studio",
  },
  {
    id: 4,
    slug: "abdullaeva-aijan",
    name: "Абдуллаева Айжан",
    firm: "Urban Design Studio",
    avatar: "/avatar4.png",
    description: "Главный архитектор Urban Design Studio",
  },
];

export default function ArchitectsPage() {
  return (
    <section className="container mx-auto relative px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-left mb-5">
        Архитекторы
      </h1>
      <Separator className="bg-[#333333] mb-6 md:mb-10 max-w-3xl" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {architects.map((architect) => (
              <Link
                key={architect.id}
                href={`/architects/${architect.slug}`}
                className="flex flex-col gap-4  p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-[140px] h-[140px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] lg:w-[156px] lg:h-[156px] overflow-hidden  border-4 border-white ">
                  <Image
                    src={architect.avatar}
                    width={156}
                    height={156}
                    alt={architect.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-[18px] sm:text-[19px] lg:text-[20px] font-semibold leading-tight">
                  {architect.name}
                </h3>

                <p className="text-[#333333] text-sm sm:text-[15px] lg:text-[16px] leading-tight">
                  {architect.firm}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-3">
          <ArchitectureFirms />
        </div>
      </div>
    </section>
  );
}
