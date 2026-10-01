// app/specialists/page.tsx
import type { Metadata } from "next";

import { fetchApi } from "@/lib/serverApi";
import { SPECIALTIES } from "@/lib/specialties";
import type { PaginatedSpecialistListListRead } from "@/services/generatedApi";

import SpecialistsIndex, {
  type InitialSpecialistsByCategory,
} from "./components/SpecialistsIndex";

export const metadata: Metadata = {
  title: "Специалисты",
  description:
    "Архитекторы, инженеры, конструкторы, дизайнеры интерьера и визуализаторы Кыргызстана",
};

export default async function SpecialistsPage() {
  // Те же параметры, с которыми разделы запрашивают список на клиенте
  const pages = await Promise.all(
    SPECIALTIES.map((specialty) =>
      fetchApi<PaginatedSpecialistListListRead>(
        `/api/specialists/?category=${specialty.id}&ordering=-rating&page=1`,
      ),
    ),
  );
  const initialByCategory: InitialSpecialistsByCategory = Object.fromEntries(
    SPECIALTIES.map((specialty, index) => [specialty.id, pages[index]]),
  );

  return <SpecialistsIndex initialByCategory={initialByCategory} />;
}
