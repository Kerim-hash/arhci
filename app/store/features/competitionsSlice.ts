// store/competitionsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Competition } from "@/types/competition";

// Моковые данные для конкурсов
const mockCompetitions: Competition[] = [
    {
        id: 1,
        slug: "museum-of-modern-art-bishkek",
        title: "Проект здания музей современного искусства г. Бишкек",
        shortDescription: "Международный архитектурный конкурс на разработку проекта музея современного искусства в центре Бишкека",
        description: "Объявляется международный архитектурный конкурс, посвящённый разработке архитектурного проекта в городе Бишкек. Конкурс направлен на поиск сильных концептуальных и реализуемых архитектурных решений, способных ответить на современные социальные, культурные и пространственные вызовы региона.",
        image: "https://images.unsplash.com/photo-1583160247711-2191776b4b91",
        openFor: ["Профессионалы", "Студенты"],
        country: "Кыргызстан",
        city: "Бишкек",
        registrationFee: "Да (60-120€)",
        prize: "грант $100 000",
        organizer: "Baihouse",
        organizerLink: "https://baihouse.kg",
        dates: {
            startRegistration: "2026-01-08",
            endRegistration: "2026-05-26",
            submissionDeadline: "2026-06-07",
            resultsAnnouncement: "2026-07-10",
        },
        tasks: [
            "Уважение к локальному контексту и культуре",
            "Современное архитектурное мышление",
            "Функциональность и пространственную логику",
            "Потенциал для реализации",
        ],
        conditions: [
            "Конкурс открыт для профессионалов и студентов",
            "Допускается индивидуальное и командное участие",
            "Регистрация открыта с 8 января 2026 года",
            "Участие платное, регистрационный взнос — от 60 до 120 € (в зависимости от этапа регистрации)",
        ],
        projectComposition: [
            "концептуальное описание проекта",
            "архитектурную идею и ключевые принципы",
            "планы, фасады и разрезы (по необходимости)",
            "визуализации или схемы, раскрывающие проект",
            "логичную и понятную подачу материалов",
        ],
        evaluationCriteria: [
            "архитектурное качество и оригинальность",
            "соответствие теме и контексту конкурса",
            "пространственная и функциональная логика",
            "потенциал реализации",
            "общее качество презентации",
        ],
        createdAt: "2025-12-01T10:00:00Z",
        updatedAt: "2025-12-01T10:00:00Z",
        views: 1250,
        participantsCount: 45,
        isActive: true,
        isFeatured: true,
    },
    {
        id: 2,
        slug: "green-architecture-2026",
        title: "Зеленая архитектура: Эко-город будущего",
        shortDescription: "Конкурс на лучший проект экологического жилого района",
        description: "Международный конкурс, посвященный разработке концепции экологичного жилого района с нулевым уровнем выбросов. Участники должны предложить инновационные решения в области устойчивой архитектуры и возобновляемой энергетики.",
        image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90",
        openFor: ["Профессионалы", "Студенты"],
        country: "Международный",
        city: "Любой",
        registrationFee: "Да (50€)",
        prize: "$50 000 + реализация",
        organizer: "Green Building Council",
        organizerLink: "https://gbc.org",
        dates: {
            startRegistration: "2026-02-01",
            endRegistration: "2026-06-01",
            submissionDeadline: "2026-07-15",
            resultsAnnouncement: "2026-08-20",
        },
        tasks: [
            "Использование возобновляемых источников энергии",
            "Эффективное водопользование",
            "Экологические материалы",
            "Интеграция с природой",
        ],
        conditions: [
            "Участие индивидуальное или командное (до 5 человек)",
            "Регистрационный взнос 50€",
            "Работы принимаются на английском языке",
        ],
        projectComposition: [
            "Концептуальное описание",
            "Мастер-план",
            "3D визуализации",
            "Энергетический расчет",
            "Презентация",
        ],
        evaluationCriteria: [
            "Экологичность решений",
            "Инновационность",
            "Экономическая эффективность",
            "Эстетика",
        ],
        createdAt: "2025-12-15T10:00:00Z",
        updatedAt: "2025-12-15T10:00:00Z",
        views: 890,
        participantsCount: 32,
        isActive: true,
        isFeatured: false,
    },
    {
        id: 3,
        slug: "heritage-revitalization",
        title: "Возрождение исторического наследия",
        shortDescription: "Конкурс на реконструкцию исторического здания",
        description: "Конкурс на лучший проект реконструкции и адаптации исторического здания под современные нужды с сохранением культурной ценности.",
        image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
        openFor: ["Профессионалы"],
        country: "Кыргызстан",
        city: "Ош",
        registrationFee: "Нет",
        prize: "$30 000",
        organizer: "Министерство культуры КР",
        organizerLink: "",
        dates: {
            startRegistration: "2026-03-01",
            endRegistration: "2026-07-01",
            submissionDeadline: "2026-08-15",
            resultsAnnouncement: "2026-09-25",
        },
        tasks: [
            "Сохранение исторической ценности",
            "Адаптация под современное использование",
            "Интеграция современных технологий",
            "Доступность для маломобильных групп",
        ],
        conditions: [
            "Только профессиональные архитекторы",
            "Наличие лицензии",
            "Портфолио за последние 3 года",
        ],
        projectComposition: [
            "Исторический анализ",
            "Проект реставрации",
            "Визуализации",
            "Пояснительная записка",
        ],
        evaluationCriteria: [
            "Сохранение наследия",
            "Качество архитектурных решений",
            "Функциональность",
        ],
        createdAt: "2026-01-10T10:00:00Z",
        updatedAt: "2026-01-10T10:00:00Z",
        views: 567,
        participantsCount: 18,
        isActive: true,
        isFeatured: false,
    },
    {
        id: 4,
        slug: "student-architecture-challenge",
        title: "Архитектурный вызов для студентов",
        shortDescription: "Ежегодный студенческий архитектурный конкурс",
        description: "Конкурс для студентов архитектурных вузов на лучший концептуальный проект общественного пространства.",
        image: "https://images.unsplash.com/photo-1486718448742-163732cd1544",
        openFor: ["Студенты"],
        country: "Международный",
        city: "Любой",
        registrationFee: "Да (30€)",
        prize: "$10 000 + стажировка",
        organizer: "International Union of Architects",
        organizerLink: "https://uia-architects.org",
        dates: {
            startRegistration: "2026-09-01",
            endRegistration: "2026-12-01",
            submissionDeadline: "2027-01-15",
            resultsAnnouncement: "2027-02-28",
        },
        tasks: [
            "Инновационное общественное пространство",
            "Устойчивое развитие",
            "Социальная инклюзивность",
        ],
        conditions: [
            "Только студенты бакалавриата и магистратуры",
            "Команда до 3 человек",
            "Необходимо подтверждение статуса студента",
        ],
        projectComposition: [
            "Концепция",
            "Визуализации",
            "Макет (по желанию)",
            "Видеопрезентация",
        ],
        evaluationCriteria: [
            "Креативность",
            "Актуальность",
            "Качество подачи",
        ],
        createdAt: "2026-02-01T10:00:00Z",
        updatedAt: "2026-02-01T10:00:00Z",
        views: 345,
        participantsCount: 67,
        isActive: false,
        isFeatured: false,
    },
    {
        id: 5,
        slug: "multilevel-parking",
        title: "Многоуровневый паркинг: Решение для мегаполиса",
        shortDescription: "Концепция современного паркинга с интеграцией зелёных технологий",
        description: "Конкурс на лучший проект многоуровневого паркинга для центральной части города.",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
        openFor: ["Профессионалы", "Студенты"],
        country: "Кыргызстан",
        city: "Бишкек",
        registrationFee: "Бесплатно",
        prize: "500 000 сом",
        organizer: "Мэрия г. Бишкек",
        dates: {
            startRegistration: "2025-03-01",
            endRegistration: "2025-06-01",
            submissionDeadline: "2025-07-15",
            resultsAnnouncement: "2025-08-30",
        },
        tasks: ["Проектирование паркинга на 500+ мест"],
        conditions: ["Гражданство КР"],
        projectComposition: ["Генплан", "Фасады", "Визуализации"],
        evaluationCriteria: ["Функциональность", "Эстетика", "Экономичность"],
        createdAt: "2025-01-15T10:00:00Z",
        updatedAt: "2025-01-15T10:00:00Z",
        views: 890,
        participantsCount: 45,
        isActive: false,
        isFeatured: false,
    },
    {
        id: 6,
        slug: "future-city-bishkek-2050",
        title: "Город будущего: Бишкек 2050",
        shortDescription: "Концепция развития городского центра на ближайшие 25 лет",
        description: "Масштабный конкурс на разработку мастер-плана центра Бишкека.",
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
        openFor: ["Профессионалы"],
        country: "Кыргызстан",
        city: "Бишкек",
        registrationFee: "Бесплатно",
        prize: "$100 000 + реализация",
        organizer: "Министерство строительства КР",
        dates: {
            startRegistration: "2025-01-01",
            endRegistration: "2025-04-01",
            submissionDeadline: "2025-06-01",
            resultsAnnouncement: "2025-07-15",
        },
        tasks: ["Мастер-план центра города", "Транспортная инфраструктура"],
        conditions: ["Международные команды допускаются"],
        projectComposition: ["Мастер-план", "Этапы реализации", "Визуализации"],
        evaluationCriteria: ["Масштаб видения", "Реализуемость", "Инновации"],
        createdAt: "2024-11-01T10:00:00Z",
        updatedAt: "2024-11-01T10:00:00Z",
        views: 1240,
        participantsCount: 89,
        isActive: false,
        isFeatured: false,
    },
    {
        id: 7,
        slug: "modern-school-standard",
        title: "Современная школа: Типовой проект",
        shortDescription: "Разработка типового проекта школы на 1200 учеников",
        description: "Конкурс на создание типового проекта современной общеобразовательной школы.",
        image: "https://images.unsplash.com/photo-1562774053-701939374585",
        openFor: ["Профессионалы"],
        country: "Кыргызстан",
        city: "Бишкек",
        registrationFee: "Бесплатно",
        prize: "700 000 сом",
        organizer: "Минобразования КР",
        dates: {
            startRegistration: "2025-02-01",
            endRegistration: "2025-05-01",
            submissionDeadline: "2025-06-30",
            resultsAnnouncement: "2025-08-01",
        },
        tasks: ["Типовой проект школы"],
        conditions: ["Лицензия на проектирование"],
        projectComposition: ["Рабочие чертежи", "Визуализации", "Смета"],
        evaluationCriteria: ["Безопасность", "Функциональность", "Бюджет"],
        createdAt: "2025-01-01T10:00:00Z",
        updatedAt: "2025-01-01T10:00:00Z",
        views: 670,
        participantsCount: 32,
        isActive: false,
        isFeatured: false,
    },
];

interface CompetitionsState {
    competitions: Competition[];
    loading: boolean;
    error: string | null;
    currentCompetition: Competition | null;
}

const initialState: CompetitionsState = {
    competitions: mockCompetitions,
    loading: false,
    error: null,
    currentCompetition: null,
};

// Async thunks
export const fetchCompetitions = createAsyncThunk(
    "competitions/fetchCompetitions",
    async () => {
        try {
            const response = await fetch('/api/competitions');
            if (!response.ok) throw new Error("API error");
            return await response.json();
        } catch {
            // Фолбэк на моковые данные, пока API не готов
            return mockCompetitions;
        }
    }
);

export const fetchCompetitionById = createAsyncThunk(
    "competitions/fetchCompetitionById",
    async (id: number) => {
        try {
            const response = await fetch(`/api/competitions/${id}`);
            if (!response.ok) throw new Error("API error");
            return await response.json();
        } catch {
            // Фолбэк на моковые данные
            const competition = mockCompetitions.find((c) => c.id === id);
            if (!competition) throw new Error("Конкурс не найден");
            return competition;
        }
    }
);

export const fetchCompetitionBySlug = createAsyncThunk(
    "competitions/fetchCompetitionBySlug",
    async (slug: string) => {
        try {
            const response = await fetch(`/api/competitions/slug/${slug}`);
            if (!response.ok) throw new Error("API error");
            return await response.json();
        } catch {
            // Фолбэк на моковые данные
            const competition = mockCompetitions.find((c) => c.slug === slug);
            if (!competition) throw new Error("Конкурс не найден");
            return competition;
        }
    }
);

export const incrementCompetitionViews = createAsyncThunk(
    "competitions/incrementCompetitionViews",
    async (id: number) => {
        try {
            await fetch(`/api/competitions/${id}/views`, { method: 'POST' });
        } catch {
            // Молча игнорируем ошибку, пока API не готов
        }
        return id;
    }
);

export const createCompetition = createAsyncThunk(
    "competitions/createCompetition",
    async (competitionData: Omit<Competition, "id" | "createdAt" | "updatedAt" | "views" | "participantsCount">) => {
        try {
            const response = await fetch("/api/competitions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(competitionData),
            });
            if (!response.ok) throw new Error("API error");
            return await response.json();
        } catch {
            // Фолбэк — создать локально с временным ID
            return {
                ...competitionData,
                id: Date.now(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                views: 0,
                participantsCount: 0,
            } as Competition;
        }
    }
);

const competitionsSlice = createSlice({
    name: "competitions",
    initialState,
    reducers: {
        setCompetitions: (state, action: PayloadAction<Competition[]>) => {
            state.competitions = action.payload;
        },
        clearCurrentCompetition: (state) => {
            state.currentCompetition = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompetitions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompetitions.fulfilled, (state, action) => {
                state.loading = false;
                state.competitions = action.payload;
            })
            .addCase(fetchCompetitions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Ошибка загрузки конкурсов";
            })
            .addCase(fetchCompetitionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompetitionById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCompetition = action.payload || null;
            })
            .addCase(fetchCompetitionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Ошибка загрузки конкурса";
            })
            .addCase(fetchCompetitionBySlug.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompetitionBySlug.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCompetition = action.payload || null;
            })
            .addCase(fetchCompetitionBySlug.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Ошибка загрузки конкурса";
            })
            .addCase(createCompetition.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCompetition.fulfilled, (state, action) => {
                state.loading = false;
                state.competitions.unshift(action.payload);
            })
            .addCase(createCompetition.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Ошибка создания конкурса";
            });
    },
});

export const { setCompetitions, clearCurrentCompetition } = competitionsSlice.actions;
export default competitionsSlice.reducer;