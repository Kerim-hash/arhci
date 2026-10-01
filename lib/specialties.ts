/**
 * Специальности, которые выбирает специалист: при регистрации и — если
 * профиль ещё не заведён (аккаунт из админки или старой регистрации) —
 * при первом проекте. Ключи совпадают с категориями бэкенда.
 */
export const SPECIALTIES = [
  { id: "architects", label: "Архитектор", icon: "/achteck.svg" },
  { id: "engineers", label: "Инженер", icon: "/engineer.svg" },
  { id: "constructors", label: "Конструктор", icon: "/engineer.svg" },
  { id: "visualizers", label: "Визуализатор", icon: "/design.svg" },
  { id: "interior-designers", label: "Дизайнер интерьера", icon: "/design.svg" },
] as const;

export type SpecialtyId = (typeof SPECIALTIES)[number]["id"];
