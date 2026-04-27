// store/features/ordersSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Order {
  id: number;
  title: string;
  budget: number;
  description: string;
  propertyType: string[]; // Жилая, Коммерческая, Благоустройство, Промышленная
  software: string[]; // ArchiCAD, AutoCAD, Revit, 3ds Max + Corona, SketchUp
}

interface OrdersState {
  activeTab: string;
  searchQuery: string;
  filters: {
    propertyTypes: string[];
    budgetFrom: string;
    budgetTo: string;
    software: string[];
  };
  orders: Order[];
}

const initialState: OrdersState = {
  activeTab: "orders",
  searchQuery: "",
  filters: {
    propertyTypes: [],
    budgetFrom: "",
    budgetTo: "",
    software: [],
  },
  orders: [
    {
      id: 1,
      title: "Разработка плана перепланировки 3-к квартиры (105 м²)",
      budget: 15000,
      description:
        "Купили квартиру в ПСО, нужно грамотно раззонировать пространство. Важно выделить отдельную гардеробную и совместить кухню с гостиной. Стены не несущие (монолит).",
      propertyType: ["Жилая"],
      software: ["ArchiCAD", "AutoCAD"],
    },
    {
      id: 2,
      title: "Эскиз входной группы для кофейни",
      budget: 25000,
      description:
        "Нужно обновить фасад и входную зону небольшого кафе в центре города. Стиль — современный минимализм, использование металла и дерева. Требуется визуализация и подбор материалов.",
      propertyType: ["Коммерческая"],
      software: ["3ds Max + Corona", "SketchUp"],
    },
    {
      id: 3,
      title: "Схема озеленения и мощения участка (6 соток)",
      budget: 12000,
      description:
        "Участок в районе Селеквиц. Нужно расположить зону барбекю, небольшую детскую площадку и продумать дорожки. Без детального дендроплана, только общая концепция и зонирование.",
      propertyType: ["Благоустройство"],
      software: ["SketchUp", "AutoCAD"],
    },
    {
      id: 4,
      title: "Перенос бумажных чертежей в AutoCAD/Revit",
      budget: 8000,
      description:
        "Есть старые чертежи частного дома в бумажном виде. Нужно аккуратно перечертить в цифру (планы этажей, 2 разреза). Исходники в хорошем состоянии.",
      propertyType: ["Жилая"],
      software: ["AutoCAD", "Revit"],
    },
  ],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    updateFilters: (
      state,
      action: PayloadAction<Partial<OrdersState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const { setActiveTab, setSearchQuery, updateFilters, resetFilters } =
  ordersSlice.actions;
export default ordersSlice.reducer;
