import apiClient from "../apiClient";

export const tenantProfileApi = {
    async getMyProfile() {
        const { data } = await apiClient.get("/tenants/me/profile");
        return data;
    },

    async createMyProfile(profile) {
        const { data } = await apiClient.post("/tenants/me/profile", profile);
        return data;
    },

    async uploadAadhaar(file) {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await apiClient.post("/tenants/me/documents/aadhaar", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    },
};
