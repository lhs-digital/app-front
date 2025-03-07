import axios from "axios";

export const TOKEN_KEY = "@app-provedores-token";

const api = axios.create({
  baseURL: "https://back.homologacao.app.lhs.digital/api",
});

api.interceptors.request.use(async (config) => {
  const JWT = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (JWT != null) {
    config.headers.Authorization = `Bearer ${JWT}`;
  }

  return config;
});

export default api;
