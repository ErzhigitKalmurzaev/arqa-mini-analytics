import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../api/baseApi';
import type { ReceiverOrderState } from '../../types/receiver/orderType';
import { AxiosError } from 'axios';


export const sendSkanDatas = createAsyncThunk<any, string, { rejectValue: string }>(
  'EmployeeSlice/sendSkanDatas',
  async (internal_code, { rejectWithValue }) => {
    try {

      const { data } = await axiosInstance.post<any>('packer/work/', { internal_code });
      return data;
    } catch (err) {
        const error = err as AxiosError;
  
        if (error.response && error.response.data) {
          // если сервер вернул строку
            if (typeof error.response.data === "string") {
                return rejectWithValue(error.response.data);
            }

        // если сервер вернул объект с message
            if ((error.response.data as any).message) {
                return rejectWithValue((error.response.data as any).message);
            }
        }}
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
const PackerSkanSLice = createSlice({
  name: 'packer_skan',
  initialState,
  reducers: {

  },
});

export const PackerSkanSLiceActions = PackerSkanSLice.actions;
export default PackerSkanSLice;
