/**
 * Специальности, которые выбирает специалист: при регистрации и — если
 * профиль ещё не заведён (аккаунт из админки или старой регистрации) —
 * при первом проекте. Ключи совпадают с категориями бэкенда.
 *
 * Здесь же тексты страниц каталога: у всех категорий одна разметка, и
 * различаются они только словами.
 */
export const SPECIALTIES = [
  {
    id: "architects",
    label: "Архитектор",
    plural: "Архитекторы",
    genitivePlural: "архитекторов",
    about: "Об архитекторе",
    intro: "Профессиональные архитекторы для создания уникальных и функциональных пространств",
    works: "Проекты",
    noWorks: "У этого специалиста пока нет проектов",
    icon: "/achteck.svg",
  },
  {
    id: "engineers",
    label: "Инженер",
    plural: "Инженеры",
    genitivePlural: "инженеров",
    about: "Об инженере",
    intro: "",
    works: "Проекты",
    noWorks: "У этого специалиста пока нет проектов",
    icon: "/engineer.svg",
  },
  {
    id: "constructors",
    label: "Конструктор",
    plural: "Конструкторы",
    genitivePlural: "конструкторов",
    about: "О конструкторе",
    intro: "",
    works: "Проекты",
    noWorks: "У этого специалиста пока нет проектов",
    icon: "/engineer.svg",
  },
  {
    id: "visualizers",
    label: "Визуализатор",
    plural: "Визуализаторы",
    genitivePlural: "визуализаторов",
    about: "О визуализаторе",
    intro: "Профессиональные 3D-визуализаторы для создания реалистичных рендеров и визуализаций",
    works: "Работы",
    noWorks: "У этого специалиста пока нет работ",
    icon: "/design.svg",
  },
  {
    id: "interior-designers",
    label: "Дизайнер интерьера",
    plural: "Дизайнеры интерьера",
    genitivePlural: "дизайнеров",
    about: "О дизайнере",
    intro: "Профессиональные дизайнеры интерьера для создания уютного и стильного пространства",
    works: "Проекты",
    noWorks: "У этого специалиста пока нет проектов",
    icon: "/design.svg",
  },
] as const;

export type Specialty = (typeof SPECIALTIES)[number];
export type SpecialtyId = Specialty["id"];

export function findSpecialty(id: string | null | undefined): Specialty | undefined {
  return SPECIALTIES.find((specialty) => specialty.id === id);
}
