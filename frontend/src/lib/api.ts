import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL as string;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Singleton refresh promise to avoid race conditions
let refreshing: Promise<string> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        // Use a plain axios call (with credentials) so the HttpOnly cookie is sent
        if (!refreshing) {
          refreshing = axios
            .post(`${BASE_URL}/user/refresh`, {}, { withCredentials: true })
            .then((r) => {
              refreshing = null;
              return r.data.accessToken as string;
            })
            .catch((e) => {
              refreshing = null;
              throw e;
            });
        }

        const newToken = await refreshing;
        localStorage.setItem("token", newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        // Refresh failed — log the user out
        localStorage.removeItem("token");
        const protectedPaths = ["/admin", "/profile", "/wishlist", "/cart"];
        if (protectedPaths.some((p) => window.location.pathname.startsWith(p))) {
          window.location.href = "/auth";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
