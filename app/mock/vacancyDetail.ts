// mock/vacancyDetail.ts
import { VacancyDetail, SimilarVacancy } from "@/types/vacancy";

export const mockSimilarVacancies: SimilarVacancy[] = [
  {
    id: 2,
    title: "Архитектор",
    salaryType: "По договоренности",
    currency: "сом",
    experience: "1-3 года",
    rating: 1.5,
    company: "Алгебра Демид Горов",
    address: "Бишкек, БЦ «История»",
  },
  {
    id: 3,
    title: "Дизайнер интерьера (Senior)",
    salaryFrom: 100000,
    salaryTo: 150000,
    currency: "сом",
    experience: "3-5 лет",
    rating: 1.5,
    company: "ОсОО Строительная компания АРЭУ",
    address: "Бишкек, ул. Елена Баева / Революция",
  },
  {
    id: 4,
    title: "Ведущий архитектор (Lead Architect)",
    salaryFrom: 120000,
    salaryTo: 180000,
    currency: "сом",
    experience: "3-5 лет",
    rating: 1.5,
    company: "ОсОО Строительная компания АРЭУ",
    address: "Бишкек, ул. Журавлева Камала, 1403",
  },
];

export const mockVacancyDetail: VacancyDetail = {
  id: 1,
  title: "Архитектор",
  salaryFrom: 120000,
  salaryTo: 180000,
  currency: "сом",
  experience: "2-6 лет",
  rating: 3.0,
  workTags: ["Картистские", "Панели", "График", "БД"],

  // Детали работы
  workPlace: "Кириллина",
  employment: "Полная",
  schedule: "8/12",
  workingHours: "8",
  workFormat: "На месте работодателя",

  description:
    "В нашу команду требуется архитектор, который поможет создавать стальные и функциональные решения.",

  responsibilities: [
    "Разработка архитектурных концепций и дизайн-проектов",
    "Подготовка чертежей, материалов и проектной документации",
    "Участие в проектировании жилых и коммерческих объектов",
    "Безопасность и инженерная, геодезическая и экологическая",
  ],

  requirements: [
    "Высшее архитектурное или строительное образование",
    "Опыт работы архитектора или дизайнера от 2 лет",
    "Умение владеть AutoCAD, ARCHICAD, 3ds Max, Revit или аналогичными программами",
    "Знание строительных материалов и их свойства",
    "Умение разрабатывать рабочее место с учетом технических стандартов, органомиров и инженерных систем",
    "Креативность, ответственность, коммуникабельность",
  ],

  offers: [
    "Стабильную работу в недвижимой компании",
    "Коммуникативную заработную плату",
    "Возможность профессионального развития",
    "Участие в международных и национальных проектах",
  ],

  keySkills: ["Архитектура", "Дизайн", "АРХИКА", "3ds Max", "Проектирование"],

  company: {
    name: "ОСДО Стратегическая компания AP2VV",
    address: "Бишкек, улица Акариба Банкова, 148/3",
    website: "https://example.com",
    description: "Крупная строительная компания с 10-летним опытом на рынке",
    phone: "+996 312 123 456",
    email: "info@ap2vv.kg",
  },

  publisher: {
    name: "Айжан К.",
    position: "HR-директор",
    phone: "+996 700 123 456",
    email: "hr@ap2vv.kg",
  },

  createdAt: "2026-04-20T10:00:00Z",
  viewsCount: 156,
  isSaved: false,
  similarVacancies: mockSimilarVacancies,
};
