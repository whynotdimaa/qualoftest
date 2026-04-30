import axios from "axios";

const api = axios.create({
  baseURL: "https://newsapi.duckdns.org/api/v1",
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const res = await axios.post(
          "https://newsapi.duckdns.org/api/v1/auth/token/refresh",
          {
            refresh: localStorage.getItem("refresh"),
          },
        );
        localStorage.setItem("access", res.data.access);
        original.headers["Authorization"] = `Bearer ${res.data.access}`;
        return api(original);
      } catch {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
