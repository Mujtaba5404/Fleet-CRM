import axios from "axios";
import { SERVER_URL } from "../constants/SERVER_URL";

const api = axios.create({
  baseURL: `${SERVER_URL}api/v1`,
});

const setAuthorizationHeader = (config) => {
  const auth = localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")) : null;

  if (auth) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
};

api.interceptors.request.use(
  (config) => setAuthorizationHeader(config),
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const serverMessage = error.response.data?.message || error.response.data?.error || `Request failed with status ${error.response.status}`;

      error.message = serverMessage;
    } else if (error.request) {
      error.message = "No response received from the server";
    } else {
      error.message = "Unexpected error occurred while making the request";
    }

    return Promise.reject(error);
  },
);

export default api;
