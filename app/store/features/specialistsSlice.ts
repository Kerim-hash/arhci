// store/specialistsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Specialist, SpecialistCategory } from "@/types/specialists";

// Моковые данные
const mockSpecialists: Specialist[] = [
  // Архитекторы
  {
    id: 1,
    slug: "abdullaev-temirlan",
    category: "architects",
    categoryName: "Архитектор",
    firm: "ARCHIDOM",
    name: "Абдуллаев Темирлан",
    avatar: "/avatar.png",
    description: "Основатель архитектурного бюро ARCHIDOM",
    rating: 4.8,
    views: 245,
    likes: 128,
  },
  {
    id: 2,
    slug: "ivanova-mariya",
    name: "Иванова Мария",
    category: "architects",
    categoryName: "Архитектор",
    firm: "Urban Design Studio",
    avatar: "/avatar2.png",
    description: "Главный архитектор Urban Design Studio",
    rating: 4.9,
    views: 312,
    likes: 156,
  },
  {
    id: 3,
    slug: "smith-john",
    name: "Смит Джон",
    category: "architects",
    categoryName: "Архитектор",
    firm: "Urban Design Studio",
    avatar: "/avatar3.png",
    description: "Ведущий архитектор",
    rating: 4.7,
    views: 189,
    likes: 94,
  },
  {
    id: 4,
    slug: "abdullaeva-aijan",
    name: "Абдуллаева Айжан",
    category: "architects",
    categoryName: "Архитектор",
    firm: "Modern Architects",
    avatar: "/avatar4.png",
    description: "Архитектор-дизайнер",
    rating: 4.9,
    views: 278,
    likes: 167,
  },
  {
    id: 5,
    slug: "petrov-sergey",
    name: "Петров Сергей",
    category: "architects",
    categoryName: "Архитектор",
    firm: "Petrov Design",
    avatar: "/avatar5.png",
    description: "Архитектор и градостроитель",
    rating: 4.6,
    views: 156,
    likes: 78,
  },
  // Инженеры
  {
    id: 6,
    slug: "kozlov-andrey",
    name: "Козлов Андрей",
    category: "engineers",
    categoryName: "Инженер",
    firm: "EngiTech Solutions",
    avatar: "/avatar6.png",
    description: "Главный инженер-конструктор",
    rating: 4.8,
    views: 189,
    likes: 95,
  },
  {
    id: 7,
    slug: "sokolova-elena",
    name: "Соколова Елена",
    category: "engineers",
    categoryName: "Инженер",
    firm: "TechBuild Group",
    avatar: "/avatar7.png",
    description: "Инженер-проектировщик",
    rating: 4.7,
    views: 145,
    likes: 82,
  },
  {
    id: 8,
    slug: "morozov-dmitry",
    name: "Морозов Дмитрий",
    category: "engineers",
    categoryName: "Инженер",
    firm: "EngiTech Solutions",
    avatar: "/avatar8.png",
    description: "Инженер-электрик",
    rating: 4.6,
    views: 134,
    likes: 67,
  },
  {
    id: 9,
    slug: "volkova-natalia",
    name: "Волкова Наталья",
    category: "engineers",
    categoryName: "Инженер",
    firm: "Green Engineering",
    avatar: "/avatar9.png",
    description: "Инженер-эколог",
    rating: 4.9,
    views: 201,
    likes: 143,
  },
  // Дизайнеры интерьера
  {
    id: 10,
    slug: "fedorova-anna",
    name: "Федорова Анна",
    category: "interior-designers",
    categoryName: "Дизайнер интерьера",
    firm: "Interior Art Studio",
    avatar: "/avatar10.png",
    description: "Старший дизайнер интерьеров",
    rating: 4.9,
    views: 267,
    likes: 189,
  },
  {
    id: 11,
    slug: "mikhailov-artem",
    name: "Михайлов Артем",
    category: "interior-designers",
    categoryName: "Дизайнер интерьера",
    firm: "Space Design",
    avatar: "/avatar11.png",
    description: "Дизайнер интерьеров",
    rating: 4.7,
    views: 178,
    likes: 92,
  },
  {
    id: 12,
    slug: "egorova-maria",
    name: "Егорова Мария",
    category: "interior-designers",
    categoryName: "Дизайнер интерьера",
    firm: "Interior Art Studio",
    avatar: "/avatar12.png",
    description: "Дизайнер-декоратор",
    rating: 4.8,
    views: 156,
    likes: 87,
  },
  {
    id: 13,
    slug: "nikolaev-pavel",
    name: "Николаев Павел",
    category: "interior-designers",
    categoryName: "Дизайнер интерьера",
    firm: "Modern Home",
    avatar: "/avatar13.png",
    description: "Дизайнер интерьеров",
    rating: 4.5,
    views: 112,
    likes: 56,
  },
  // Визуализаторы
  {
    id: 14,
    slug: "smirnova-olga",
    name: "Смирнова Ольга",
    category: "visualizers",
    categoryName: "Визуализатор",
    firm: "3D Vision Studio",
    avatar: "/avatar14.png",
    description: "3D-визуализатор",
    rating: 4.9,
    views: 234,
    likes: 167,
  },
  {
    id: 15,
    slug: "popov-ivan",
    name: "Попов Иван",
    category: "visualizers",
    categoryName: "Визуализатор",
    firm: "RenderPro",
    avatar: "/avatar15.png",
    description: "Архитектурный визуализатор",
    rating: 4.8,
    views: 198,
    likes: 134,
  },
  {
    id: 16,
    slug: "vasilieva-ekaterina",
    name: "Васильева Екатерина",
    category: "visualizers",
    categoryName: "Визуализатор",
    firm: "3D Vision Studio",
    avatar: "/avatar16.png",
    description: "CG-художник",
    rating: 4.7,
    views: 145,
    likes: 89,
  },
];

interface SpecialistsState {
  specialists: Specialist[];
  loading: boolean;
  error: string | null;
}

const initialState: SpecialistsState = {
  specialists: mockSpecialists,
  loading: false,
  error: null,
};

export const specialistsSlice = createSlice({
  name: "specialists",
  initialState,
  reducers: {
    setSpecialists: (state, action: PayloadAction<Specialist[]>) => {
      state.specialists = action.payload;
    },
    updateSpecialistStats: (
      state,
      action: PayloadAction<{ id: number; views?: number; likes?: number }>,
    ) => {
      const specialist = state.specialists.find(
        (s) => s.id === action.payload.id,
      );
      if (specialist) {
        if (action.payload.views) specialist.views = action.payload.views;
        if (action.payload.likes) specialist.likes = action.payload.likes;
      }
    },
  },
});

export const { setSpecialists, updateSpecialistStats } =
  specialistsSlice.actions;
export default specialistsSlice.reducer;
