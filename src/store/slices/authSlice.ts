import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from '../../util/helpers/secureStorage';
import { connectSocket, disconnectSocket } from '../../actions/sockets/socket.actions';
import { login as apiLogin, logout as apiLogout, register as apiRegister, getProfile } from '../../actions/core/auth.actions';
import type { User } from '../../util/types/user.types';
import type { AuthState } from '../../util/types/redux.types';

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiLogin(email, password);
      const user: User = {
        ...(response.user ?? (response as any)),
        id: response.user?.id || (response as any).id || '',
        _id: response.user?._id || (response as any)._id || response.user?.id || '',
        isAdmin: response.user?.isAdmin ?? false,
        token: response.token,
      };
      const token = response.token;
      await SecureStore.setItemAsync('karaadi_token', token);
      await SecureStore.setItemAsync('karaadi_user', JSON.stringify(user));
      if (user.id) connectSocket(user.id);
      return { user, token };
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (payload: { username: string; email: string; password: string; phone?: string }, { rejectWithValue }) => {
    try {
      return await apiRegister(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await apiLogout();
  await SecureStore.deleteItemAsync('karaadi_token');
  await SecureStore.deleteItemAsync('karaadi_user');
  disconnectSocket();
});

export const loadFromStorage = createAsyncThunk(
  'auth/loadFromStorage',
  async (_: void, { dispatch }) => {
    const token = await SecureStore.getItemAsync('karaadi_token');
    const userJson = await SecureStore.getItemAsync('karaadi_user');
    if (!token || !userJson) return null;

    const user = JSON.parse(userJson) as User;
    if (user.id) connectSocket(user.id);
    getProfile()
      .then((fresh) => {
        if (fresh) {
          const updated = { ...user, ...fresh, token };
          dispatch(setCredentials({ user: updated, token }));
          SecureStore.setItemAsync('karaadi_user', JSON.stringify(updated));
        }
      })
      .catch(() => {});
    return { user, token };
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
      })
      .addCase(loadFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadFromStorage.fulfilled, (state, action) => {
        state.user = action.payload?.user ?? null;
        state.token = action.payload?.token ?? null;
        state.loading = false;
      })
      .addCase(loadFromStorage.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
      });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
