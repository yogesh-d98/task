import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../api/auth';
import authReducer from '../features/auth/authSlice';

const persistedAuth = localStorage.getItem("auth");

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  preloadedState: {
    auth: persistedAuth ? JSON.parse(persistedAuth) : undefined,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
