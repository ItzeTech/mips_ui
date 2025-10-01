// wsTokenManager.ts
import axios from "axios";
import { setCredentials, logout, logoutUserApi } from "../features/auth/authSlice";
import { clearUser } from "../features/user/userSlice";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

let isRefreshing = false;
let refreshQueue: Array<{ resolve: (token: string) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  refreshQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  refreshQueue = [];
};

export const refreshWebSocketToken = async (storeRef: any): Promise<string> => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      refreshQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/token/refresh`, {}, { withCredentials: true });

    const newAccessToken = data.access_token;
    const newRoles = data.roles;

    storeRef.dispatch(setCredentials({ access_token: newAccessToken, token_type: "bearer", roles: newRoles }));

    processQueue(null, newAccessToken);
    return newAccessToken;
  } catch (error) {
    processQueue(error, null);
    await storeRef.dispatch(logoutUserApi());
    await storeRef.dispatch(logout());
    clearUser();
    window.location.href = "/login";
    throw error;
  } finally {
    isRefreshing = false;
  }
};
