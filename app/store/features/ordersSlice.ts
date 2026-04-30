// store/features/ordersSlice.ts — Подключен к бэкенду через RTK Query (generatedApi)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrdersState {
  activeTab: string;
  searchQuery: string;
  filters: {
    propertyTypes: string[];
    budgetFrom: string;
    budgetTo: string;
    software: string[];
  };
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

// Re-export хуки из generatedApi
export {
  useApiOrdersListQuery,
  useApiOrdersRetrieveQuery,
  useApiOrdersCreateCreateMutation,
  useApiOrdersRespondCreateMutation,
} from "@/services/generatedApi";
