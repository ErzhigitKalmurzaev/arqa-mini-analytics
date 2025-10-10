import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../api/baseApi';
import type { IOrder, OrderProps, OrderState, OrderStatisticsData, PositionQRs, ProductBarcode } from '../../types/director/OrderTypes';

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

export const getOrdersStatistics = createAsyncThunk<OrderStatisticsData, any, { rejectValue: string }>(
  'EmployeeSlice/getOrdersStatistics',
  async (props, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<OrderStatisticsData>(`director/order/?order_id=${props}`);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Ошибка загрузки заказов');
    }
  }
);

export const getStatements = createAsyncThunk<IOrder[], void, { rejectValue: string }>(
  'EmployeeSlice/getStatements',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<IOrder[]>('director/statement/list/');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Ошибка загрузки заказов');
    }
  }
);

export const postStatement = createAsyncThunk<any, any, { rejectValue: string }>(
  'EmployeeSlice/postStatement',
  async (props, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post<any>('director/statement/update/', props);
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

export const postPositionQRs = createAsyncThunk<any, PositionQRs, { rejectValue: string }>(
  'EmployeeSlice/postPositionQRs',
  async (order, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('order_id', order.order_id);
      formData.append('product_title', order.product_title);
      formData.append('color', order.color);
      formData.append('size', order.size);
      formData.append('file', order.file);

      const { data } = await axiosInstance.post<any>('director/pdf/hs-code/', formData);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Ошибка создания заказа');
    }
  }
)

export const postProductBarcodes = createAsyncThunk<any, ProductBarcode, { rejectValue: string }>(
  'EmployeeSlice/postProductBarcodes',
  async (order, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('order_id', order.order_id);
      formData.append('product_title', order.product_title);
      formData.append('file', order.file);

      const { data } = await axiosInstance.post<any>('director/pdf/wb-code/', formData);
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
  statements: [],
  statements_status: 'loading',
  order: null,
  order_status: 'loading',
  order_statistics: {
    summary: {
      RECEIVER: 0,
      OTK: 0,
      PACKER: 0,
      MARKER: 0,
      CONTROLLER: 0,
      DEFECT: 0,
    },
    info: []
  },
  order_statistics_status: 'loading',
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
      })

      .addCase(getStatements.pending, (state) => {
        state.statements_status = 'loading';
      })
      .addCase(getStatements.fulfilled, (state, action) => {
        state.statements = action.payload;
        state.statements_status = 'success';
      })
      .addCase(getStatements.rejected, (state) => {
        state.statements_status = 'error';
      })

      .addCase(getOrdersStatistics.pending, (state) => {
        state.order_statistics_status = 'loading';
      })
      .addCase(getOrdersStatistics.fulfilled, (state, action) => {
        state.order_statistics = action.payload;
        state.order_statistics_status = 'success';
      })
      .addCase(getOrdersStatistics.rejected, (state) => {
        state.order_statistics_status = 'error';
      })
  },
});

export const OrderSliceActions = OrderSlice.actions;
export default OrderSlice;
