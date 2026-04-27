// store/features/orderDetailSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

// Отклик на заказ
export const respondToOrder = createAsyncThunk(
  'orderDetail/respond',
  async (id: string) => {
    // Имитация запроса к API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Позже замените на реальный API:
    // const response = await fetch(`/api/orders/${id}/respond`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ orderId: id }),
    // });
    // return response.json();
    
    return { success: true, message: 'Отклик на заказ отправлен' };
  }
);

const orderDetailSlice = createSlice({
  name: 'orderDetail',
  initialState,
  reducers: {
    clearOrderDetail: (state) => {
      state.loading = false;
      state.error = null;
      state.isResponding = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(respondToOrder.pending, (state) => {
        state.isResponding = true;
        state.error = null;
      })
      .addCase(respondToOrder.fulfilled, (state) => {
        state.isResponding = false;
        // Здесь можно добавить уведомление об успехе
        console.log('Отклик на заказ успешно отправлен');
      })
      .addCase(respondToOrder.rejected, (state, action) => {
        state.isResponding = false;
        state.error = action.error.message || 'Ошибка при отклике на заказ';
        console.error('Ошибка при отклике:', action.error);
      });
  },
});

export const { clearOrderDetail } = orderDetailSlice.actions;
export default orderDetailSlice.reducer;