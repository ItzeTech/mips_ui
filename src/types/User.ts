// types/User.ts or inside authSlice.ts
export interface User {
    id: string;
    email: string;
    name?: string;
    roles?: string[];
  }
  