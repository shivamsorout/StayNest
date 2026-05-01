import apiClient from "../apiClient";

export const authApi = {
    async login(email, password) {
        const { data } = await apiClient.post("/auth/login", { email, password });
        if (data.token) {
            localStorage.setItem("user", JSON.stringify(data));
        }
        return data;
    },

    async signup(fullName, email, password) {
        const { data } = await apiClient.post("/auth/signup", { fullName, email, password });
        return data;
    },

    async forgotPassword(email) {
        const { data } = await apiClient.post("/auth/forgot-password", { email });
        return data;
    },
};
