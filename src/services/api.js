import axios from "axios";

export const TOKEN_KEY = "@app-provedores-token";

const api = axios.create({
  // baseURL: "https://back.app.lhs.digital/api",
  // baseURL: "http://127.0.0.1:8000/api",
  baseURL: "http://back.homologacao.app.lhs.digital/api",
});

api.interceptors.request.use(async (config) => {
  const JWT = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (JWT != null) {
    config.headers.Authorization = `Bearer ${JWT}`;
  }

  return config;
});

export default api;
