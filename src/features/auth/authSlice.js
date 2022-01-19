import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {loginAPI} from './authAPI';
import jwt_decode from 'jwt-decode';
import {getTokens, clearStorage} from '../../services/encryptedStorage';

export const userLoginAsync = createAsyncThunk(
  'auth/login',
  async (values, {rejectWithValue}) => {
    // thunkAPI.rejectWithValue is used to provide custom payload in rejected action
    try {
      const response = await loginAPI(values.email, values.password);
      return response.data;
    } catch (e) {
      let error = {data: e.response.data, status: e.response.status};
      return rejectWithValue(error);
    }
  },
);

export const getAuthTokensAsync = createAsyncThunk(
  'auth/getAuthTokens',
  async (_, {rejectWithValue}) => {
    try {
      const response = await getTokens();
      return response;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  },
);

export const removeAuthTokensAsync = createAsyncThunk(
  'auth/removeAuthTokens',
  async (_, {rejectWithValue}) => {
    try {
      const response = await clearStorage();
      return response;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: null,
    isLoggedIn: false,
    status: 'idle', // idle/ pending/ succeeded/ failed
    error: null,
  },
  reducers: {
    setAuth: (state, action) => {
      state.userId = action.payload;
      state.isLoggedIn = true;
    },
    removeAuth: state => {
      state.userId = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(userLoginAsync.pending, state => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(userLoginAsync.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.status = 'succeeded';
        state.error = null;

        // get user_id from access token
        //================================================
        const tokenParts = jwt_decode(action.payload.access);
        state.userId = tokenParts.user_id;
      })
      .addCase(userLoginAsync.rejected, (state, action) => {
        // console.log('Rejected : ', action.payload);
        state.isLoggedIn = false;
        state.userId = null;
        state.status = 'failed';
      })
      .addCase(getAuthTokensAsync.pending, state => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(getAuthTokensAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getAuthTokensAsync.rejected, (state, action) => {
        console.log(action.payload);
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeAuthTokensAsync.pending, state => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(removeAuthTokensAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userId = null;
        state.isLoggedIn = false;
        state.error = null;
      })
      .addCase(removeAuthTokensAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {setAuth, removeAuth} = authSlice.actions;

export default authSlice.reducer;
