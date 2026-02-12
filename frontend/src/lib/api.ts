// import axios from "axios";

// const api = axios.create({
//   // baseURL: "http://localhost:5000",
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ⭐ MOST IMPORTANT
  withCredentials: false, // cookies use nahi kar rahe
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
