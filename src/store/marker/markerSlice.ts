import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../api/baseApi';
import { AxiosError } from 'axios';

interface markerState {
    files: any
    files_status: string 
}

export const getProductFiles = createAsyncThunk<any, string, { rejectValue: string }>(
  'EmployeeSlice/getProductFiles',
  async (internal_code, { rejectWithValue }) => {
    try {

      const { data } = await axiosInstance.get<any>(`marker/work/get/images/?internal_code=${internal_code}`);
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

export const repeadFileRequest = createAsyncThunk<any, string, { rejectValue: string }>(
  'EmployeeSlice/repeadFileRequest',
  async (internal_code, { rejectWithValue }) => {
    try {

      const { data } = await axiosInstance.post<any>(`marker/create/statement/`, { internal_code });
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

export const printedLabels = createAsyncThunk<any, string, { rejectValue: string }>(
  'EmployeeSlice/repeadFileRequest',
  async (internal_code, { rejectWithValue }) => {
    try {

      const { data } = await axiosInstance.post<any>(`marker/work/`, { internal_code });
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
const initialState: markerState = {
  files: [],
  files_status: 'loading',
};

// slice
const markerSLice = createSlice({
  name: 'packer_skan',
  initialState,
  reducers: {

  },
});

export const markerSLiceActions = markerSLice.actions;
export default markerSLice;
