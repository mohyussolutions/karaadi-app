import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from '../../lib/helpers/device/secureStorage';
import { connectSocket, disconnectSocket } from '../../actions/sockets/socket.actions';
import { login as apiLogin, logout as apiLogout, register as apiRegister, getProfile } from '../../actions/core/auth.actions';
import type { AuthState, LoginArgs, LoginResponse, RegisterPayload, SessionPayload, SetCredentialsAction, User } from '../../utils/types';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../../actions/constants/app.constants';
import { clearCredentials } from '../actions/authActions';

export { clearCredentials };

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: LoginArgs, { rejectWithValue }) => {
    try {
      const response = await apiLogin(email, password) as LoginResponse;
      const user: User = {
        ...(response.user ?? response),
        id: response.user?.id || response.id || '',
        _id: response.user?._id || response._id || response.user?.id || '',
        isAdmin: response.user?.isAdmin ?? false,
        token: response.token,
      };
      const token = response.token;
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
      await SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(user));
      if (user.id) connectSocket(user.id);
      return { user, token };
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      return await apiRegister(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await apiLogout();
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(AUTH_USER_KEY);
  disconnectSocket();
});

export const saveSession = createAsyncThunk(
  'auth/saveSession',
  async ({ user, token }: SessionPayload, { dispatch }) => {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    await SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(user));
    dispatch(setCredentials({ user, token }));
    if (user.id) connectSocket(user.id);
  },
);

export const clearSession = createAsyncThunk('auth/clearSession', async (_: void, { dispatch }) => {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(AUTH_USER_KEY);
  disconnectSocket();
  dispatch(clearCredentials());
});

export const loadFromStorage = createAsyncThunk(
  'auth/loadFromStorage',
  async (_: void, { dispatch }) => {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    const userJson = await SecureStore.getItemAsync(AUTH_USER_KEY);
    if (!token || !userJson) return null;

    const user = JSON.parse(userJson) as User;
    if (user.id) connectSocket(user.id);
    getProfile()
      .then((fresh) => {
        if (fresh) {
          const updated = { ...user, ...fresh, token };
          dispatch(setCredentials({ user: updated, token }));
          SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(updated));
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
    setCredentials: (state, action: SetCredentialsAction) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
    },
  },
  selectors: {
    selectUser: (state) => state.user,
    selectAuthToken: (state) => state.token,
    selectAuthLoading: (state) => state.loading,
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearCredentials, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
      })
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

export const { setCredentials } = authSlice.actions;
export const { selectUser, selectAuthToken, selectAuthLoading } = authSlice.selectors;
export default authSlice.reducer;
