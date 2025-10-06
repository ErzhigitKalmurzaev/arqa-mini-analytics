import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../api/baseApi';
import type { IOrder, IOrderProps, IOrderReceiver, ReceiverOrderState } from '../../types/receiver/orderType';

// thunk
export const getOrders = createAsyncThunk<IOrder[], void, { rejectValue: string }>(
  'EmployeeSlice/getClients',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<IOrder[]>('receiver/order/list/');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Ошибка загрузки заказов');
    }
  }
);

export const sendQRDatas = createAsyncThunk<IOrderReceiver, IOrderProps, { rejectValue: string }>(
  'EmployeeSlice/sendQRDatas',
  async (order, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('order_id', order.order_id)
      formData.append('title', order.title)
      formData.append('color', order.color)
      formData.append('size', order.size)
      formData.append('internal_code', order.internal_code)
      formData.append('file', order.file)

      const { data } = await axiosInstance.post<IOrderReceiver>('receiver/reception/', formData);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Ошибка создания заказа');
    }
  }
)


// initialState
const initialState: ReceiverOrderState = {
  orders: [],
  orders_status: 'loading',
  order: null,
  order_status: 'loading',
};

// slice
const ReceiverOrderSlice = createSlice({
  name: 'receiver_order',
  initialState,
  reducers: {
    getValueOrder: (state, action) => {
      state.order = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.orders_status = 'loading';
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.orders_status = 'success';
      })
      .addCase(getOrders.rejected, (state) => {
        state.orders_status = 'error';
      });
  },
});

export const { getValueOrder } = ReceiverOrderSlice.actions;
export default ReceiverOrderSlice;
