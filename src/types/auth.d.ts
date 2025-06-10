export interface User {
    // Define user properties if any, apart from roles
    // e.g., id: string; email: string; name?: string;
  }
  
  export interface AuthState {
    accessToken: string | null;
    refreshToken?: string | null; // If you manage refresh token in client state (less secure for web)
    roles: string[];
    isAuthenticated: boolean;
    user: User | null; // You can decode token to get user info or get it from /me endpoint
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }
  
  export interface LoginResponse {
      access_token: string;
      token_type: string; // "bearer"
      roles: string[];
  }
  