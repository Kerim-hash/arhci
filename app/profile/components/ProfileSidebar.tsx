"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, User as UserIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useApiSpecialistsRetrieveQuery } from "@/services/generatedApi";
import { User } from "@/types/user";

export function ProfileSidebar({ user }: { user?: User }) {
  const { data: specialist } = useApiSpecialistsRetrieveQuery(
    { slug: user?.specialistSlug || "" },
    { skip: !user?.specialistSlug }
  );

  const displayName =
    user?.name ||
    (user?.first_name || user?.firstName
      ? `${user?.first_name || user?.firstName || ""} ${user?.last_name || user?.lastName || ""}`.trim()
      : "Пользователь");

  const roleLabel =
    user?.position || (user?.role === "specialist" ? "Специалист" : "Компания");

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 sticky top-24">
      <div className="text-center mb-6">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <Image
            src={user?.image || "/user.svg"}
            alt="Avatar"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <h3 className="font-semibold text-lg">{displayName}</h3>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-[#949494]">
          <UserIcon className="w-3.5 h-3.5" />
          <span>{roleLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-[#949494]">
          <MapPin className="w-3.5 h-3.5" />
          <span>г.Бишкек, Кыргызстан</span>
        </div>
        {user?.email && (
          <div className="flex items-center gap-2 text-[#949494] min-w-0">
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
        )}
      </div>

      <Separator className="my-6 bg-[#333] h-[1px]" />

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <p>Просмотры проектов</p>
          <p>{specialist?.views || 0}</p>
        </div>
        <div className="flex justify-between items-center text-sm">
          <p>Оценки</p>
          <p>{specialist?.likes || 0}</p>
        </div>
      </div>

      <Link href="/profile/settings" className="block mt-6">
        <Button className="w-full rounded-[40px]">Изменить профиль</Button>
      </Link>
    </div>
  );
}
