import axios from "axios";
import { AUTH_SERVER_URL, SERVER_URL } from "../constants/SERVER_URL";

export const AUTH_STORAGE_KEY = "auth";

/** Auth360: sign in, refresh, sign out and password changes. */
export const authApi = axios.create({
  baseURL: `${AUTH_SERVER_URL}api/v1`,
  withCredentials: true,
});

const api = axios.create({
  baseURL: `${SERVER_URL}api/v1`,
  withCredentials: true,
});

export const readAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
  } catch {
    return null;
  }
};

/** Raised when the session cannot be refreshed; RequireAuth listens for it. */
export const SESSION_EXPIRED_EVENT = "fleet360:session-expired";

export const clearAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("globalFilters");

  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
};

api.interceptors.request.use(
  (config) => {
    const auth = readAuth();
    const token = auth?.accessToken ?? auth?.token;

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error),
);

// One refresh at a time: a burst of 401s all wait on the same request.
let refreshing = null;

const refreshSession = () => {
  refreshing ??= authApi.get("auth/refresh").finally(() => {
    refreshing = null;
  });

  return refreshing;
};

const describeError = (error) => {
  if (error.response) {
    return (
      error.response.data?.message ||
      error.response.data?.error ||
      `Request failed with status ${error.response.status}`
    );
  }

  if (error.request) return "No response received from the server";

  return "Unexpected error occurred while making the request";
};

const normalizeError = (error) => {
  error.message = describeError(error);

  return Promise.reject(error);
};

authApi.interceptors.response.use((response) => response, normalizeError);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;

    // An expired access token: refresh once, then replay the request.
    if (error.response?.status === 401 && request && !request._retried) {
      request._retried = true;

      try {
        await refreshSession();

        return await api(request);
      } catch {
        clearAuth();
      }
    }

    return normalizeError(error);
  },
);

export default api;
