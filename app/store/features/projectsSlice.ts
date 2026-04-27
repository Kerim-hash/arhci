// store/projectsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "@/types/project";

// Моковые данные для проектов
const mockProjects: Project[] = [
  // Проекты Абдуллаева Темирлана (id: 1)
  {
    id: 1,
    title: "Жилой комплекс «Эдельвейс»",
    description:
      "Современный жилой комплекс с элементами национальной архитектуры. 12 этажей, 120 квартир, подземный паркинг. Проект включает в себя благоустройство прилегающей территории, детские площадки и зоны для отдыха.",
    specialistId: 1,
    specialistSlug: "abdullaev-temirlan",
    specialistName: "Абдуллаев Темирлан",
    specialistAvatar: "/avatar.png",
    previewImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
        isPreview: true,
        alt: "Вид снаружи",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
        isPreview: false,
        alt: "Вид внутри",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1484154218962-a197022b5858",
        isPreview: false,
        alt: "Территория",
      },
    ],
    createdAt: "2023-05-15T10:00:00Z",
    updatedAt: "2023-05-15T10:00:00Z",
    views: 1245,
    likes: 89,
  },
  {
    id: 2,
    title: "Бизнес-центр «Ала-Тоо»",
    description:
      "Многофункциональный бизнес-центр класса А с офисными помещениями, конференц-залами и кафе. Общая площадь 15 000 кв.м. Современные системы вентиляции и освещения.",
    specialistId: 1,
    specialistSlug: "abdullaev-temirlan",
    specialistName: "Абдуллаев Темирлан",
    specialistAvatar: "/avatar.png",
    previewImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    images: [
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
        isPreview: true,
        alt: "Фасад",
      },
      {
        id: 5,
        url: "https://images.unsplash.com/photo-1497366218048-7c4e04d7b5b2",
        isPreview: false,
        alt: "Интерьер",
      },
    ],
    createdAt: "2022-11-20T10:00:00Z",
    updatedAt: "2022-11-20T10:00:00Z",
    views: 892,
    likes: 67,
  },
  {
    id: 3,
    title: "Частная школа «Сапат»",
    description:
      "Образовательный комплекс с современными классами, лабораториями и спортивными площадками. Инновационная архитектура с использованием экологичных материалов.",
    specialistId: 1,
    specialistSlug: "abdullaev-temirlan",
    specialistName: "Абдуллаев Темирлан",
    specialistAvatar: "/avatar.png",
    previewImage: "https://images.unsplash.com/photo-1562774053-701939374585",
    images: [
      {
        id: 6,
        url: "https://images.unsplash.com/photo-1562774053-701939374585",
        isPreview: true,
        alt: "Школа",
      },
    ],
    createdAt: "2021-08-10T10:00:00Z",
    updatedAt: "2021-08-10T10:00:00Z",
    views: 634,
    likes: 45,
  },
  // Проекты Ивановой Марии (id: 2)
  {
    id: 4,
    title: "Культурный центр «Азия»",
    description:
      "Многофункциональный культурный центр с концертным залом на 500 мест, выставочными пространствами и библиотекой. Современная архитектура с элементами восточного стиля.",
    specialistId: 2,
    specialistSlug: "ivanova-mariya",
    specialistName: "Иванова Мария",
    specialistAvatar: "/avatar2.png",
    previewImage:
      "https://images.unsplash.com/photo-1583160247711-2191776b4b91",
    images: [
      {
        id: 7,
        url: "https://images.unsplash.com/photo-1583160247711-2191776b4b91",
        isPreview: true,
        alt: "Центр",
      },
    ],
    createdAt: "2022-06-25T10:00:00Z",
    updatedAt: "2022-06-25T10:00:00Z",
    views: 745,
    likes: 56,
  },
  // Добавим еще проекты для других специалистов
  {
    id: 5,
    title: "Жилой комплекс «Зеленый берег»",
    description:
      "Эко-проект жилого комплекса с панорамными окнами и зелеными зонами. Комплекс включает в себя подземный паркинг, детский сад и спортивные площадки.",
    specialistId: 3,
    specialistSlug: "smith-john",
    specialistName: "Смит Джон",
    specialistAvatar: "/avatar3.png",
    previewImage:
      "https://images.unsplash.com/photo-1513584684374-8bab748fbf90",
    images: [
      {
        id: 8,
        url: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90",
        isPreview: true,
        alt: "Вид снаружи",
      },
      {
        id: 9,
        url: "https://images.unsplash.com/photo-1484154218962-a197022b5858",
        isPreview: false,
        alt: "Территория",
      },
    ],
    createdAt: "2023-03-10T10:00:00Z",
    updatedAt: "2023-03-10T10:00:00Z",
    views: 567,
    likes: 43,
  },
  {
    id: 6,
    title: "Офисное здание «Технопарк»",
    description:
      "Современный бизнес-центр класса B+ с коворкингами, переговорными и зонами отдыха. Умные системы управления зданием.",
    specialistId: 4,
    specialistSlug: "abdullaeva-aijan",
    specialistName: "Абдуллаева Айжан",
    specialistAvatar: "/avatar4.png",
    previewImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    images: [
      {
        id: 10,
        url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
        isPreview: true,
        alt: "Фасад",
      },
      {
        id: 11,
        url: "https://images.unsplash.com/photo-1497366218048-7c4e04d7b5b2",
        isPreview: false,
        alt: "Интерьер",
      },
    ],
    createdAt: "2022-09-15T10:00:00Z",
    updatedAt: "2022-09-15T10:00:00Z",
    views: 432,
    likes: 38,
  },
  // Проекты инженеров
  {
    id: 7,
    title: "Расчёт конструкций ЖК «Эдельвейс»",
    description: "Полный расчёт несущих конструкций 12-этажного жилого комплекса. Применение BIM-моделирования для оптимизации расхода материалов.",
    specialistId: 6,
    specialistSlug: "kozlov-andrey",
    specialistName: "Козлов Андрей",
    specialistAvatar: "/avatar6.png",
    previewImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd",
    images: [{ id: 12, url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd", isPreview: true, alt: "Конструкции" }],
    createdAt: "2023-04-10T10:00:00Z",
    updatedAt: "2023-04-10T10:00:00Z",
    views: 312,
    likes: 27,
  },
  {
    id: 8,
    title: "Инженерные системы БЦ «Ала-Тоо»",
    description: "Проектирование систем вентиляции, отопления и кондиционирования бизнес-центра класса A. Интеграция умного управления зданием.",
    specialistId: 6,
    specialistSlug: "kozlov-andrey",
    specialistName: "Козлов Андрей",
    specialistAvatar: "/avatar6.png",
    previewImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
    images: [{ id: 13, url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12", isPreview: true, alt: "Системы" }],
    createdAt: "2022-11-05T10:00:00Z",
    updatedAt: "2022-11-05T10:00:00Z",
    views: 245,
    likes: 19,
  },
  {
    id: 9,
    title: "Проект водоснабжения посёлка «Ак-Жол»",
    description: "Комплексный проект системы водоснабжения и водоотведения для коттеджного посёлка на 200 домов.",
    specialistId: 7,
    specialistSlug: "sokolova-elena",
    specialistName: "Соколова Елена",
    specialistAvatar: "/avatar7.png",
    previewImage: "https://images.unsplash.com/photo-1590486803822-1e80e1c0c1e8",
    images: [{ id: 14, url: "https://images.unsplash.com/photo-1590486803822-1e80e1c0c1e8", isPreview: true, alt: "Инфраструктура" }],
    createdAt: "2023-01-20T10:00:00Z",
    updatedAt: "2023-01-20T10:00:00Z",
    views: 178,
    likes: 14,
  },
  // Проекты дизайнеров интерьера
  {
    id: 10,
    title: "Квартира в стиле лофт — ЖК «Эдельвейс»",
    description: "Дизайн-проект двухкомнатной квартиры 85 кв.м. Индустриальный стиль с тёплыми акцентами дерева и латуни.",
    specialistId: 10,
    specialistSlug: "fedorova-anna",
    specialistName: "Федорова Анна",
    specialistAvatar: "/avatar10.png",
    previewImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    images: [{ id: 15, url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2", isPreview: true, alt: "Гостиная" }],
    createdAt: "2023-06-15T10:00:00Z",
    updatedAt: "2023-06-15T10:00:00Z",
    views: 534,
    likes: 67,
  },
  {
    id: 11,
    title: "Офис IT-компании «TechSpace»",
    description: "Открытое пространство на 120 сотрудников с зонами для работы, переговоров и отдыха. Биофильный дизайн.",
    specialistId: 10,
    specialistSlug: "fedorova-anna",
    specialistName: "Федорова Анна",
    specialistAvatar: "/avatar10.png",
    previewImage: "https://images.unsplash.com/photo-1497366216548-37526070297c",
    images: [{ id: 16, url: "https://images.unsplash.com/photo-1497366216548-37526070297c", isPreview: true, alt: "Офис" }],
    createdAt: "2022-09-20T10:00:00Z",
    updatedAt: "2022-09-20T10:00:00Z",
    views: 412,
    likes: 52,
  },
  {
    id: 12,
    title: "Ресторан «Восток» — интерьер",
    description: "Дизайн интерьера ресторана на 80 посадочных мест. Восточные мотивы в современном прочтении.",
    specialistId: 11,
    specialistSlug: "mikhailov-artem",
    specialistName: "Михайлов Артем",
    specialistAvatar: "/avatar11.png",
    previewImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    images: [{ id: 17, url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", isPreview: true, alt: "Ресторан" }],
    createdAt: "2023-02-10T10:00:00Z",
    updatedAt: "2023-02-10T10:00:00Z",
    views: 289,
    likes: 34,
  },
  // Проекты визуализаторов
  {
    id: 13,
    title: "3D-визуализация ЖК «Горный»",
    description: "Фотореалистичная визуализация фасадов и территории жилого комплекса премиум-класса в горной местности.",
    specialistId: 14,
    specialistSlug: "smirnova-olga",
    specialistName: "Смирнова Ольга",
    specialistAvatar: "/avatar14.png",
    previewImage: "https://images.unsplash.com/photo-1486718448742-163732cd1544",
    images: [{ id: 18, url: "https://images.unsplash.com/photo-1486718448742-163732cd1544", isPreview: true, alt: "Визуализация" }],
    createdAt: "2023-07-01T10:00:00Z",
    updatedAt: "2023-07-01T10:00:00Z",
    views: 678,
    likes: 89,
  },
  {
    id: 14,
    title: "Виртуальный тур — БЦ «Ала-Тоо»",
    description: "Интерактивный 3D-тур по бизнес-центру с возможностью перемещения по всем этажам и помещениям.",
    specialistId: 14,
    specialistSlug: "smirnova-olga",
    specialistName: "Смирнова Ольга",
    specialistAvatar: "/avatar14.png",
    previewImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    images: [{ id: 19, url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2", isPreview: true, alt: "Тур" }],
    createdAt: "2022-12-15T10:00:00Z",
    updatedAt: "2022-12-15T10:00:00Z",
    views: 456,
    likes: 61,
  },
  {
    id: 15,
    title: "Рендеры коттеджного посёлка «Ак-Жол»",
    description: "Серия экстерьерных и интерьерных визуализаций для маркетинговой кампании застройщика.",
    specialistId: 15,
    specialistSlug: "popov-ivan",
    specialistName: "Попов Иван",
    specialistAvatar: "/avatar15.png",
    previewImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
    images: [{ id: 20, url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9", isPreview: true, alt: "Коттеджи" }],
    createdAt: "2023-03-25T10:00:00Z",
    updatedAt: "2023-03-25T10:00:00Z",
    views: 345,
    likes: 42,
  },
];

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  currentProject: Project | null;
}

const initialState: ProjectsState = {
  projects: mockProjects,
  loading: false,
  error: null,
  currentProject: null,
};

// Async thunks для работы с API
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    // TODO: Заменить на реальный API запрос
    // const response = await fetch('/api/projects');
    // return response.json();
    return mockProjects;
  },
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (id: number) => {
    // TODO: Заменить на реальный API запрос
    // const response = await fetch(`/api/projects/${id}`);
    // return response.json();
    return mockProjects.find((p) => p.id === id);
  },
);

export const fetchProjectsBySpecialist = createAsyncThunk(
  "projects/fetchProjectsBySpecialist",
  async (specialistId: number) => {
    // TODO: Заменить на реальный API запрос
    // const response = await fetch(`/api/projects/specialist/${specialistId}`);
    // return response.json();
    return mockProjects.filter((p) => p.specialistId === specialistId);
  },
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (
    projectData: Omit<
      Project,
      "id" | "createdAt" | "updatedAt" | "views" | "likes"
    >,
  ) => {
    // TODO: Заменить на реальный API запрос
    // const response = await fetch('/api/projects', {
    //   method: 'POST',
    //   body: JSON.stringify(projectData),
    // });
    // return response.json();
    return {
      ...projectData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
    };
  },
);

export const incrementProjectViews = createAsyncThunk(
  "projects/incrementProjectViews",
  async (id: number) => {
    // TODO: Заменить на реальный API запрос
    // await fetch(`/api/projects/${id}/views`, { method: 'POST' });
    return id;
  },
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProjects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки проектов";
      })
      // fetchProjectById
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload || null;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки проекта";
      })
      // fetchProjectsBySpecialist
      .addCase(fetchProjectsBySpecialist.fulfilled, (state, action) => {
        state.projects = action.payload;
      });
  },
});

export const { setProjects, clearCurrentProject } = projectsSlice.actions;
export default projectsSlice.reducer;
