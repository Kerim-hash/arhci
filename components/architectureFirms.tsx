import Link from "next/link";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

export default function ArchitectureFirms() {
  return (
    <div className="sticky top-27.5">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок - Архитектурные бюро */}
        <Card className="mb-5">
          <h5 className="text-[20px] font-semibold text-[#333333] mb-2">
            Архитектурные бюро
          </h5>

          <div className="flex flex-wrap gap-4">
            <p className="text-[#333333] text-[16px] hover:text-[#4677F3]">
              Schema
            </p>
            <p className="text-[#333333] text-[16px] hover:text-[#4677F3]">
              GeoMetric Design
            </p>
            <p className="text-[#333333] text-[16px] hover:text-[#4677F3]">
              Plane & Angle Studio
            </p>
            <p className="text-[#333333] text-[16px] hover:text-[#4677F3]">
              Zenith
            </p>
          </div>
        </Card>
        <Separator className="bg-[#333333] mb-5" />
        <Card className="">
          <h5 className="text-[20px] font-semibold text-[#333333] mb-2">
            Архитекторы
          </h5>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/architects/ivanova-mariya"
              className="text-[#333333] text-[16px] hover:text-[#4677F3]"
            >
              Иванова Мария
            </Link>
            <Link
              href="/architects/abdullaev-temirlan"
              className="text-[#333333] text-[16px] hover:text-[#4677F3]"
            >
              Абдуллаев Темирлан
            </Link>
            <Link
              href="/architects/smith-john"
              className="text-[#333333] text-[16px] hover:text-[#4677F3]"
            >
              Смит Джон
            </Link>
            <Link
              href="/architects/abdullaeva-aijan"
              className="text-[#333333] text-[16px] hover:text-[#4677F3]"
            >
              Абдуллаева Айжан
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
