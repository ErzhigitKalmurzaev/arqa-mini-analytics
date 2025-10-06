import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../api/baseApi';
import type { IOrder, OrderProps, OrderState } from '../../types/director/OrderTypes';

// thunk
export const getOrders = createAsyncThunk<IOrder[], void, { rejectValue: string }>(
  'EmployeeSlice/getClients',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<IOrder[]>('director/order/read/');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Ошибка загрузки заказов');
    }
  }
);

export const getOrderById = createAsyncThunk<IOrder, any, { rejectValue: string }>(
  'EmployeeSlice/getClients',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<IOrder>(`director/order/read/${id}/`);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Ошибка загрузки заказов');
    }
  }
);

export const createOrder = createAsyncThunk<IOrder, OrderProps, { rejectValue: string }>(
  'EmployeeSlice/createClient',
  async (order, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post<IOrder>('director/order/crud/', order);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Ошибка создания заказа');
    }
  }
)

export const editOrder = createAsyncThunk<IOrder, {order: OrderProps, id: string | undefined}, { rejectValue: string }>(
  'EmployeeSlice/editOrder',
  async ({ order, id }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch<IOrder>(`director/order/crud/${id}/`, order);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Ошибка создания заказа');
    }
  }
)


// initialState
const initialState: OrderState = {
  orders: [],
  orders_status: 'loading',
  order: null,
  order_status: 'loading',
};

// slice
const OrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {

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

export const OrderSliceActions = OrderSlice.actions;
export default OrderSlice;
