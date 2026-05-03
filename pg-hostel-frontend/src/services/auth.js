import { authApi } from "../api/auth/authApi";

const readStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        localStorage.removeItem("user");
        return null;
    }
};

export const authService = {
    async login(email, password) {
        return authApi.login(email, password);
    },

    async signup(fullName, email, password, mobileNumbers, accountType) {
        return authApi.signup(fullName, email, password, mobileNumbers, accountType);
    },
    
    async forgotPassword(payload) {
        return authApi.forgotPassword(payload);
    },

    async resetPassword(payload) {
        return authApi.resetPassword(payload);
    },

    async changePassword(payload) {
        return authApi.changePassword(payload);
    },

    async getProfile() {
        return authApi.getProfile();
    },

    async updateProfile(payload) {
        const profile = await authApi.updateProfile(payload);
        const user = this.getCurrentUser();
        if (user) {
            localStorage.setItem("user", JSON.stringify({ ...user, ...profile }));
        }
        return profile;
    },

    logout() {
        localStorage.removeItem("user");
    },

    getCurrentUser() {
        return readStoredUser();
    },

    isAuthenticated() {
        return !!readStoredUser()?.token;
    }
};
