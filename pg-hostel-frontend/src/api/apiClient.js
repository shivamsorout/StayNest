import axios from "axios";

const apiHost = ["0.0.0.0", "::"].includes(window.location.hostname)
    ? "localhost"
    : window.location.hostname;

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || `http://${apiHost}:8080/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        localStorage.removeItem("user");
    }

    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("user");
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        const message = error.response?.data?.message || error.message || "Something went wrong";
        return Promise.reject(new Error(message));
    }
);

export default apiClient;
