import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../api/baseApi';

export const logIn = createAsyncThunk(
    'technologProduct/logIn',
    async (props: { username: string, password: string }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('token/login/', props);
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const getProfile = createAsyncThunk(
    'technologProduct/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get('user/staff/info/');
            return data;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

interface IAuthState {
  user: any;
  isAuthenticated: string;
  me_role: number;
  me_info_status: string;
}

const initialState: IAuthState = {
  user: null,
  isAuthenticated: 'loading',
  me_role: 0,
  me_info_status: 'loading'
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    logout: (state: any) => {
      state.user = null;
      state.me_role = 0;
      state.isAuthenticated = '';
      localStorage.removeItem('level_token');
      localStorage.removeItem('level_refresh_token');
      localStorage.removeItem('level_role');
    },
    checkAuth: (state: any) => {
      const user = localStorage.getItem('level_token');
      const user_role = localStorage.getItem('level_role');
      if (user) {
        state.isAuthenticated = 'success';
        state.me_role = Number(user_role);
      } else {
        state.isAuthenticated = 'error';
        state.me_role = 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(logIn.pending, (state) => {
            state.isAuthenticated = 'loading';
        }).addCase(logIn.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = 'success';
            state.me_role = action.payload?.role;
            localStorage.setItem('level_token', action.payload?.access);
            localStorage.setItem('level_refresh_token', action.payload?.refresh);
            localStorage.setItem('level_role', action.payload?.role);
        }).addCase(logIn.rejected, (state) => {
            state.isAuthenticated = 'error';
        })
    }
});

export const { logout, checkAuth } = AuthSlice.actions;
export default AuthSlice;
