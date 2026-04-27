// store/features/resumesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface WorkExperience {
  company: string;
  position?: string;
  startDate: string;
  endDate: string;
  duties: string[];
  achievement?: string;
}

export interface Resume {
  id: number;
  name: string;
  salaryFrom: number;
  salaryTo: number;
  experience: string;
  specialization: string[];
  category: string;
  description: string;
  about: string;
  software: string[];
  employmentType: string[];
  region: string;
  avatar: string;
  workPlace: string;
  employment: string;
  schedule: string;
  phone: string;
  email: string;
  socialLinks: string[];
  keySkills: string[];
  workExperience: WorkExperience[];
}

interface ResumesFilters {
  specializations: string[];
  software: string[];
  experience: string;
  employmentType: string[];
  incomeFrom: string;
  incomeTo: string;
  hasIncome: boolean;
  region: string;
}

interface ResumesState {
  resumes: Resume[];
  currentResume: Resume | null;
  searchQuery: string;
  filters: ResumesFilters;
  loading: boolean;
  error: string | null;
}

const mockResumes: Resume[] = [
  {
    id: 1,
    name: "Айбек Турсунов",
    salaryFrom: 120000,
    salaryTo: 180000,
    experience: "3-6 лет",
    specialization: ["Архитекторы"],
    category: "Архитектор",
    description:
      "Жилая недвижимость, Проектирование объектов ХоРеКа (рестораны, бутик-отели)",
    about:
      "Опытный архитектор с фокусом на интеграцию современных инженерных решений и эстетики минимализма. Специализируюсь на проектировании жилых и общественных пространств, от концептуального эскиза до авторского надзора. Сторонник междисциплинарного подхода: соединяю классическую архитектурную школу с передовыми технологиями визуализации и автоматизации процессов.",
    software: ["ArchiCAD", "AutoCAD", "SketchUp"],
    employmentType: ["Полный день (В штат)", "Проектно"],
    region: "bishkek",
    avatar: "/avatars/specialist-1.jpg",
    workPlace: "Кыргызстан",
    employment: "Полная",
    schedule: "5/2",
    phone: "+996 502 155 122",
    email: "a.tursunov@gmail.com",
    socialLinks: ["instagram", "telegram", "linkedin"],
    keySkills: ["Архитектура", "Дизайн", "ArchiCAD", "3ds Max", "Проектирование"],
    workExperience: [
      {
        company: 'Компания ООО "Standart"',
        startDate: "Январь 2020",
        endDate: "Настоящее время",
        duties: [
          "Руководство командой из 5+ проектировщиков и дизайнеров.",
          "Разработка и реализация крупных объектов (ЖК, бизнес-центры, частные виллы).",
          "Оптимизация проектных циклов за счёт внедрения BIM-стандартов.",
        ],
        achievement:
          "Сократил сроки согласования чертежей на 20% благодаря автоматизации типовых узлов.",
      },
      {
        company: 'ООО "Carnage"',
        startDate: "Январь 2018",
        endDate: "2020",
        duties: [
          "Руководство командой из 5+ проектировщиков и дизайнеров.",
          "Разработка и реализация крупных объектов (ЖК, бизнес-центры, частные виллы).",
          "Оптимизация проектных циклов за счёт внедрения BIM-стандартов.",
        ],
        achievement:
          "Сократил сроки согласования чертежей на 20% благодаря автоматизации типовых узлов.",
      },
    ],
  },
  {
    id: 2,
    name: "Марат Жумабаев",
    salaryFrom: 150000,
    salaryTo: 200000,
    experience: "1-3 года",
    specialization: ["Архитекторы"],
    category: "Архитектор",
    description:
      "Жилая недвижимость, Проектирование объектов ХоРеКа (рестораны, бутик-отели)",
    about:
      "Молодой архитектор с амбициозным подходом к проектированию. Специализируюсь на жилой архитектуре и объектах общепита. Владею современными инструментами проектирования и визуализации.",
    software: ["ArchiCAD", "Revit"],
    employmentType: ["Фриланс"],
    region: "bishkek",
    avatar: "/avatars/specialist-2.jpg",
    workPlace: "Кыргызстан",
    employment: "Фриланс",
    schedule: "Свободный",
    phone: "+996 555 100 200",
    email: "m.zhumabaev@gmail.com",
    socialLinks: ["instagram", "telegram"],
    keySkills: ["Архитектура", "ArchiCAD", "Revit", "Проектирование"],
    workExperience: [
      {
        company: "Архитектурное бюро «Мирас»",
        startDate: "Март 2022",
        endDate: "Настоящее время",
        duties: [
          "Разработка архитектурных проектов жилых домов.",
          "Создание рабочей документации.",
          "Согласование проектов с заказчиками.",
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Данияр Кадыров",
    salaryFrom: 150000,
    salaryTo: 180000,
    experience: "1-3 года",
    specialization: ["Инженеры"],
    category: "Инженер",
    description:
      "Жилая недвижимость, Проектирование объектов ХоРеКа (рестораны, бутик-отели)",
    about:
      "Инженер-конструктор с опытом проектирования несущих конструкций жилых и общественных зданий. Работаю с BIM-технологиями, обеспечиваю точность расчётов и оптимизацию материалов.",
    software: ["AutoCAD", "Revit"],
    employmentType: ["Полный день (В штат)"],
    region: "osh",
    avatar: "/avatars/specialist-3.jpg",
    workPlace: "Кыргызстан, Ош",
    employment: "Полная",
    schedule: "5/2",
    phone: "+996 770 300 400",
    email: "d.kadyrov@mail.ru",
    socialLinks: ["telegram"],
    keySkills: ["Инженерия", "AutoCAD", "Revit", "Расчёт конструкций", "BIM"],
    workExperience: [
      {
        company: "ПИ «ОшГражданПроект»",
        startDate: "Июнь 2021",
        endDate: "Настоящее время",
        duties: [
          "Проектирование несущих конструкций жилых объектов.",
          "Расчёт нагрузок и подбор сечений.",
          "Разработка рабочей документации раздела КР.",
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Алмаз Сатыбалдиев",
    salaryFrom: 100000,
    salaryTo: 150000,
    experience: "1-3 года",
    specialization: ["Визуализаторы"],
    category: "Визуализатор",
    description:
      "Жилая недвижимость, Проектирование объектов ХоРеКа (рестораны, бутик-отели)",
    about:
      "3D-визуализатор с художественным образованием. Создаю фотореалистичные рендеры интерьеров и экстерьеров. Работаю быстро и качественно, понимаю архитектурный контекст.",
    software: ["3ds Max + Corona", "SketchUp"],
    employmentType: ["Фриланс", "Проектно"],
    region: "bishkek",
    avatar: "/avatars/specialist-4.jpg",
    workPlace: "Удалённо",
    employment: "Фриланс",
    schedule: "Свободный",
    phone: "+996 700 500 600",
    email: "a.satybaldiev@gmail.com",
    socialLinks: ["instagram", "behance"],
    keySkills: ["3ds Max", "Corona Renderer", "SketchUp", "Photoshop", "Визуализация"],
    workExperience: [
      {
        company: "Фриланс",
        startDate: "Сентябрь 2021",
        endDate: "Настоящее время",
        duties: [
          "Создание фотореалистичных визуализаций интерьеров и экстерьеров.",
          "Работа с архитектурными бюро на проектной основе.",
          "Постобработка рендеров в Photoshop.",
        ],
      },
    ],
  },
  {
    id: 5,
    name: "Бекзат Тологонов",
    salaryFrom: 200000,
    salaryTo: 280000,
    experience: "3-6 лет",
    specialization: ["Дизайнеры интерьер"],
    category: "Дизайнер интерьера",
    description:
      "Дизайн интерьеров жилых и коммерческих помещений, авторский надзор",
    about:
      "Дизайнер интерьеров с 5-летним опытом. Специализируюсь на премиальных жилых интерьерах и коммерческих пространствах. Веду проекты от концепции до авторского надзора. Работаю в современном и классическом стилях.",
    software: ["ArchiCAD", "3ds Max + Corona", "AutoCAD"],
    employmentType: ["Полный день (В штат)", "Фриланс"],
    region: "bishkek",
    avatar: "/avatars/specialist-5.jpg",
    workPlace: "Кыргызстан",
    employment: "Полная / Фриланс",
    schedule: "5/2",
    phone: "+996 555 700 800",
    email: "b.tologonov@gmail.com",
    socialLinks: ["instagram", "telegram", "behance"],
    keySkills: ["Дизайн интерьера", "ArchiCAD", "3ds Max", "Авторский надзор", "Проектирование"],
    workExperience: [
      {
        company: "Студия дизайна «Loft Design»",
        startDate: "Февраль 2020",
        endDate: "Настоящее время",
        duties: [
          "Разработка дизайн-проектов квартир и коммерческих помещений.",
          "Авторский надзор на объектах.",
          "Подбор материалов и мебели.",
          "Ведение переговоров с заказчиками.",
        ],
        achievement: "Реализовал 30+ проектов интерьеров за 3 года.",
      },
    ],
  },
  {
    id: 6,
    name: "Эрлан Асанов",
    salaryFrom: 250000,
    salaryTo: 350000,
    experience: "6+ лет",
    specialization: ["Архитекторы", "Инженеры"],
    category: "Архитектор",
    description:
      "Проектирование промышленных объектов, жилых комплексов, BIM-моделирование",
    about:
      "Опытный архитектор с фокусом на интеграцию современных инженерных решений и эстетики минимализма. Специализируюсь на проектировании жилых и общественных пространств, от концептуального эскиза до авторского надзора. Сторонник междисциплинарного подхода: соединяю классическую архитектурную школу с передовыми технологиями визуализации и автоматизации процессов.",
    software: ["Revit", "AutoCAD", "ArchiCAD"],
    employmentType: ["Полный день (В штат)"],
    region: "bishkek",
    avatar: "/avatars/specialist-6.jpg",
    workPlace: "Кыргызстан",
    employment: "Полная",
    schedule: "5/2",
    phone: "+996 502 155 122",
    email: "d.asanovdesign@gmail.com",
    socialLinks: ["instagram", "telegram", "linkedin"],
    keySkills: ["Архитектура", "Дизайн", "ArchiCAD", "3ds Max", "Проектирование"],
    workExperience: [
      {
        company: 'Компания ООО "Standart"',
        startDate: "Январь 2020",
        endDate: "Настоящее время",
        duties: [
          "Руководство командой из 5+ проектировщиков и дизайнеров.",
          "Разработка и реализация крупных объектов (ЖК, бизнес-центры, частные виллы).",
          "Оптимизация проектных циклов за счёт внедрения BIM-стандартов.",
        ],
        achievement:
          "Сократил сроки согласования чертежей на 20% благодаря автоматизации типовых узлов.",
      },
      {
        company: 'ООО "Carnage"',
        startDate: "Январь 2018",
        endDate: "2020",
        duties: [
          "Руководство командой из 5+ проектировщиков и дизайнеров.",
          "Разработка и реализация крупных объектов (ЖК, бизнес-центры, частные виллы).",
          "Оптимизация проектных циклов за счёт внедрения BIM-стандартов.",
        ],
        achievement:
          "Сократил сроки согласования чертежей на 20% благодаря автоматизации типовых узлов.",
      },
    ],
  },
];

// Async thunks
export const fetchResumes = createAsyncThunk(
  "resumes/fetchResumes",
  async () => {
    try {
      const response = await fetch('/api/resumes');
      if (!response.ok) throw new Error("API error");
      return await response.json();
    } catch {
      // Фолбэк на моковые данные, пока API не готов
      return mockResumes;
    }
  }
);

export const fetchResumeById = createAsyncThunk(
  "resumes/fetchResumeById",
  async (id: number) => {
    try {
      const response = await fetch(`/api/resumes/${id}`);
      if (!response.ok) throw new Error("API error");
      return await response.json();
    } catch {
      // Фолбэк на моковые данные
      const resume = mockResumes.find((r) => r.id === id);
      if (!resume) throw new Error("Резюме не найдено");
      return resume;
    }
  }
);

export const createResume = createAsyncThunk(
  "resumes/createResume",
  async (resumeData: Omit<Resume, "id">) => {
    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      });
      if (!response.ok) throw new Error("API error");
      return await response.json();
    } catch {
      // Фолбэк — создать локально с временным ID
      return { ...resumeData, id: Date.now() } as Resume;
    }
  }
);

const initialState: ResumesState = {
  resumes: mockResumes,
  currentResume: null,
  searchQuery: "",
  filters: {
    specializations: [],
    software: [],
    experience: "",
    employmentType: [],
    incomeFrom: "",
    incomeTo: "",
    hasIncome: false,
    region: "",
  },
  loading: false,
  error: null,
};

const resumesSlice = createSlice({
  name: "resumes",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    updateFilters: (
      state,
      action: PayloadAction<Partial<ResumesFilters>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentResume: (state) => {
      state.currentResume = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки резюме";
      })
      .addCase(fetchResumeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResume = action.payload;
      })
      .addCase(fetchResumeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки резюме";
      })
      .addCase(createResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes.unshift(action.payload);
      })
      .addCase(createResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка создания резюме";
      });
  },
});

export const { setSearchQuery, updateFilters, resetFilters, clearCurrentResume } =
  resumesSlice.actions;
export default resumesSlice.reducer;
