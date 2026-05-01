import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:8080/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
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
