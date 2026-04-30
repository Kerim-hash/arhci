// store/features/orderDetailSlice.ts — Подключен к бэкенду через RTK Query (generatedApi)
import { createSlice } from '@reduxjs/toolkit';

interface OrderDetailState {
  loading: boolean;
  error: string | null;
  isResponding: boolean;
}

const initialState: OrderDetailState = {
  loading: false,
  error: null,
  isResponding: false,
};

const orderDetailSlice = createSlice({
  name: 'orderDetail',
  initialState,
  reducers: {
    clearOrderDetail: (state) => {
      state.loading = false;
      state.error = null;
      state.isResponding = false;
    },
    setIsResponding: (state, action) => {
      state.isResponding = action.payload;
    },
  },
});

export const { clearOrderDetail, setIsResponding } = orderDetailSlice.actions;
export default orderDetailSlice.reducer;

// Re-export хуки из generatedApi
export {
  useApiOrdersRetrieveQuery,
  useApiOrdersRespondCreateMutation,
} from "@/services/generatedApi";