import { createApi } from '@reduxjs/toolkit/query/react';
// import type { RootState } from '../app/store';
// import { BASE_URL, VERSION } from '../constants/url';
import baseQueryWithReauth from './baseQuery';
import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '../types';
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (newUser) => ({
        url: '/auth/signup',
        method: 'POST',
        body: newUser,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
