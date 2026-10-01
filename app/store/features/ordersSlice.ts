// store/features/ordersSlice.ts — Подключен к бэкенду через RTK Query (generatedApi)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// У заказов на бэкенде нет фильтров, кроме поиска и страницы.
interface OrdersState {
  activeTab: string;
  searchQuery: string;
}

const initialState: OrdersState = {
  activeTab: "orders",
  searchQuery: "",
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
  },
});

export const { setActiveTab, setSearchQuery } = ordersSlice.actions;
export default ordersSlice.reducer;

// Re-export хуки из generatedApi
export {
  useApiOrdersListQuery,
  useApiOrdersRetrieveQuery,
  useApiOrdersCreateCreateMutation,
  useApiOrdersRespondCreateMutation,
} from "@/services/generatedApi";
