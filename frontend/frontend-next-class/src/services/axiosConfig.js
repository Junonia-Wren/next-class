import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api"
});

// INTERCEPTOR PARA AGREGAR TOKEN AUTOMÁTICAMENTE
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// OPCIONAL: INTERCEPTOR PARA ERRORES 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Token inválido o expirado");
            sessionStorage.removeItem("authToken");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
