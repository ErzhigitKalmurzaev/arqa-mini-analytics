import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../api/baseApi';
import type { EmployeeProps, EmployeeState, IEmployee } from '../../types/director/EmployeeTypes';

// thunk
export const getEmployees = createAsyncThunk<IEmployee[], void, { rejectValue: string }>(
  'EmployeeSlice/getEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<IEmployee[]>('director/staff/crud/');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Ошибка загрузки сотрудников');
    }
  }
);

export const getEmployeeById = createAsyncThunk<IEmployee, any, { rejectValue: string }>(
    'EmployeeSlice/getEmployeeById',
    async (id, { rejectWithValue }) => {
      try {
        const { data } = await axiosInstance.get<IEmployee>(`director/staff/crud/${id}/`);
        return data;
      } catch (err: any) {
        return rejectWithValue(err.message ?? 'Ошибка загрузки сотрудников');
      }
    }
  );

export const createEmployee = createAsyncThunk<IEmployee, EmployeeProps, { rejectValue: string }>(
  'EmployeeSlice/createEmployee',
  async (employee, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post<IEmployee>('director/staff/crud/', employee);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Ошибка создания сотрудника');
    }
  }
)

export const editEmployee = createAsyncThunk<IEmployee, {employee: EmployeeProps, id: string | undefined}, { rejectValue: string }>(
    'EmployeeSlice/editEmployee',
    async ({ employee, id }, { rejectWithValue }) => {
      try {
        const { data } = await axiosInstance.patch<IEmployee>(`director/staff/crud/${id}/`, employee);
        return data;
      } catch (err: any) {
        return rejectWithValue(err.message ?? 'Ошибка создания сотрудника');
      }
    }
  )


  export const deleteEmployee = createAsyncThunk<IEmployee, {id: string | undefined}, { rejectValue: string }>(
  'EmployeeSlice/deleteEmployee',
  async ({ id }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete<IEmployee>(`director/staff/crud/${id}/`);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Ошибка создания сотрудника');
    }
  }
)

// initialState
const initialState: EmployeeState = {
  employees: [],
  employees_status: 'loading',
  employee: null,
  employee_status: 'loading',
};

// slice
const EmployeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployees.pending, (state) => {
        state.employees_status = 'loading';
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.employees = action.payload;
        state.employees_status = 'success';
      })
      .addCase(getEmployees.rejected, (state) => {
        state.employees_status = 'error';
      });
  },
});

export const EmployeeSliceActions = EmployeeSlice.actions;
export default EmployeeSlice;
