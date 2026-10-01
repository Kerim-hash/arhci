// app/work/model/options.ts
//
// Общие списки вариантов для форм создания и сайдбаров фильтров раздела
// «Работа». Фильтры на бэкенде сравнивают строки как есть, поэтому форма
// и фильтр обязаны использовать один и тот же набор значений.

export const EMPLOYMENT_OPTIONS = [
  "Полная занятость",
  "Частичная занятость",
  "Проектная работа",
  "Стажировка",
];

export const SOFTWARE_OPTIONS = [
  "ArchiCAD",
  "AutoCAD",
  "Revit",
  "SketchUp",
  "3ds Max + Corona",
  "Photoshop",
  "Rhino",
];

export const EXPERIENCE_OPTIONS = ["Без опыта", "1-3 года", "3-6 лет", "6+ лет"];

// В вакансии опыт может быть не зафиксирован — договариваются на собеседовании.
export const VACANCY_EXPERIENCE_OPTIONS = [...EXPERIENCE_OPTIONS, "По договорённости"];

// Значение — русское название города: бэкенд ищет регион через `icontains`
// по месту работы, поэтому латинские ключи вроде `bishkek` ничего не находят.
export const REGIONS = [
  { value: "Бишкек", label: "Бишкек" },
  { value: "Ош", label: "Ош" },
];
