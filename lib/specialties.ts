/**
 * Специальности, которые выбирает специалист: при регистрации и — если
 * профиль ещё не заведён (аккаунт из админки или старой регистрации) —
 * при первом проекте. Ключи совпадают с категориями бэкенда.
 */
export const SPECIALTIES = [
  { id: "architects", label: "Архитектор", plural: "Архитекторы", icon: "/achteck.svg" },
  { id: "engineers", label: "Инженер", plural: "Инженеры", icon: "/engineer.svg" },
  { id: "constructors", label: "Конструктор", plural: "Конструкторы", icon: "/engineer.svg" },
  { id: "visualizers", label: "Визуализатор", plural: "Визуализаторы", icon: "/design.svg" },
  {
    id: "interior-designers",
    label: "Дизайнер интерьера",
    plural: "Дизайнеры интерьера",
    icon: "/design.svg",
  },
] as const;

export type SpecialtyId = (typeof SPECIALTIES)[number]["id"];
