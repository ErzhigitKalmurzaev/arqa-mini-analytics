import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../api/baseApi';
import type { IOrder, IOrderProps, ReceiverOrderState } from '../../types/receiver/orderType';

interface ISkanDatas {
    internal_code: string,
    comment: string
    images: any
    is_defect: boolean
}

export const sendSkanDatas = createAsyncThunk<any, ISkanDatas, { rejectValue: string }>(
  'EmployeeSlice/sendSkanDatas',
  async (order, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('internal_code', order.internal_code)
      if(order.is_defect) {
        formData.append('is_defect', 'true')
        formData.append('comment', order.comment)
        order.images.forEach((item: any) => {
          formData.append('image', item.file)
        })
      }

      const { data } = await axiosInstance.post<any>('otk/work/', formData);
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
const OTKSkanSLice = createSlice({
  name: 'otk_skan',
  initialState,
  reducers: {

  },
});

export const OTKSkanSLiceActions = OTKSkanSLice.actions;
export default OTKSkanSLice;
