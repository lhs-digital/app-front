import axios from "axios";

export const TOKEN_KEY = "@app-provedores-token";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
});

api.interceptors.request.use(async (config) => {
    const JWT = localStorage.getItem("token");
    if (JWT != null) {
        config.headers.Authorization = `Bearer ${JWT}`;
    }

    return config;
})

export default api;