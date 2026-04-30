const API_URL = "http://localhost:8080/api/auth";

export const authService = {
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) throw new Error("Login failed");
            const data = await response.json();
            if (data.token) {
                localStorage.setItem("user", JSON.stringify(data));
            }
            return data;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    },

    async signup(username, email, password) {
        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });
            if (!response.ok) throw new Error("Signup failed");
            return await response.text();
        } catch (error) {
            console.error("Signup Error:", error);
            throw error;
        }
    },
    
    async forgotPassword(email) {
        try {
            const response = await fetch(`${API_URL}/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to send reset link");
            }
            return await response.text();
        } catch (error) {
            console.error("Forgot Password Error:", error);
            throw error;
        }
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
