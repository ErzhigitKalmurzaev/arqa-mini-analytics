import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../api/baseApi';
import type { ClientState, IClient, IClientProps } from '../../types/director/ClientTypes';

// thunk
export const getClients = createAsyncThunk<IClient[], void, { rejectValue: string }>(
  'EmployeeSlice/getClients',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<IClient[]>('director/client/crud/');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Ошибка загрузки сотрудников');
    }
  }
);

export const getClientById = createAsyncThunk<IClient, any, { rejectValue: string }>(
    'EmployeeSlice/getClientById',
    async (id, { rejectWithValue }) => {
      try {
        const { data } = await axiosInstance.get<IClient>(`director/client/crud/${id}/`);
        return data;
      } catch (err: any) {
        return rejectWithValue(err.message ?? 'Ошибка загрузки сотрудников');
      }
    }
  );

export const createClient = createAsyncThunk<IClient, IClientProps, { rejectValue: string }>(
  'EmployeeSlice/createClient',
  async (employee, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post<IClient>('director/client/crud/', employee);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Ошибка создания сотрудника');
    }
  }
)

export const editClient = createAsyncThunk<IClient, {client: IClientProps, id: string | undefined}, { rejectValue: string }>(
    'EmployeeSlice/editClient',
    async ({ client, id }, { rejectWithValue }) => {
      try {
        const { data } = await axiosInstance.patch<IClient>(`director/client/crud/${id}/`, client);
        return data;
      } catch (err: any) {
        return rejectWithValue(err.message ?? 'Ошибка создания сотрудника');
      }
    }
  )

export const deleteClient = createAsyncThunk<IClient, {id: string | undefined}, { rejectValue: string }>(
  'EmployeeSlice/deleteClient',
  async ({ id }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete<IClient>(`director/client/crud/${id}/`);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message ?? 'Ошибка создания сотрудника');
    }
  }
)

// initialState
const initialState: ClientState = {
  clients: [],
  clients_status: 'loading',
  client: null,
  client_status: 'loading',
};

// slice
const ClientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getClients.pending, (state) => {
        state.clients_status = 'loading';
      })
      .addCase(getClients.fulfilled, (state, action) => {
        state.clients = action.payload;
        state.clients_status = 'success';
      })
      .addCase(getClients.rejected, (state) => {
        state.clients_status = 'error';
      });
  },
});

export const ClientSliceActions = ClientSlice.actions;
export default ClientSlice;
