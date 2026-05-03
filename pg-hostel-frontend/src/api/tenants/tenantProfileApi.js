import apiClient from "../apiClient";

export const tenantProfileApi = {
    async getMyProfile() {
        const { data } = await apiClient.get("/tenants/me/profile");
        return data;
    },
};
