import axios from "axios";
import { API_BASE_URL } from "../utils/backendMeta";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    if (status !== 401 || original?._retry || original?.skipAuthRetry) {
      return Promise.reject(error);
    }

    original._retry = true;
    const refresh = localStorage.getItem("refresh");

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/auth/token/refresh`,
        { refresh },
        { headers: { "Content-Type": "application/json" } },
      );
      localStorage.setItem("access", data.access);
      if (data.refresh) {
        localStorage.setItem("refresh", data.refresh);
      }
      original.headers.Authorization = `Bearer ${data.access}`;
      return api(original);
    } catch {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

/** Вихід із бекендом за можливості; завжди очищає локальне сховище. */
export async function logoutApi() {
  const refresh = localStorage.getItem("refresh");
  try {
    await api.post("/auth/logout/", { refresh_token: refresh ?? "" });
  } catch {
    /* ignore */
  }
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

export default api;
