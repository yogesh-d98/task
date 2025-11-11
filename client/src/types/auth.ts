// types/auth.ts

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  result: {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'employee' | 'admin';
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface SignupResponse {
  result: {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'employee' | 'admin';
    };
  };
  success: boolean;
  message: string;
}
