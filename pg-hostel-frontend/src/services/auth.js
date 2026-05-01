import { authApi } from "../api/auth/authApi";

export const authService = {
    async login(email, password) {
        return authApi.login(email, password);
    },

    async signup(fullName, email, password) {
        return authApi.signup(fullName, email, password);
    },
    
    async forgotPassword(email) {
        return authApi.forgotPassword(email);
    },

    logout() {
        localStorage.removeItem("user");
    },

    getCurrentUser() {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!localStorage.getItem("user");
    }
};
