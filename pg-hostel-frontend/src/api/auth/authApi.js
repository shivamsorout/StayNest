import apiClient from "../apiClient";

export const authApi = {
    async login(email, password) {
        const { data } = await apiClient.post("/auth/login", { email, password });
        if (data.token) {
            localStorage.setItem("user", JSON.stringify(data));
        }
        return data;
    },

    async signup(fullName, email, password, mobileNumbers = [], accountType = "OWNER") {
        const { data } = await apiClient.post("/auth/signup", { fullName, email, password, mobileNumbers, accountType });
        return data;
    },

    async forgotPassword(payload) {
        const { data } = await apiClient.post("/auth/forgot-password", payload);
        return data;
    },

    async resetPassword(payload) {
        const { data } = await apiClient.post("/auth/reset-password", payload);
        return data;
    },

    async changePassword(payload) {
        const { data } = await apiClient.post("/auth/change-password", payload);
        return data;
    },

    async getProfile() {
        const { data } = await apiClient.get("/auth/profile");
        return data;
    },

    async updateProfile(payload) {
        const { data } = await apiClient.put("/auth/profile", payload);
        return data;
    },
};
