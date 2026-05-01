import apiClient from "../apiClient";

export const tenantApi = {
    async getTenants() {
        const { data } = await apiClient.get("/tenants");
        return data;
    },

    async getActiveTenants() {
        const { data } = await apiClient.get("/tenants/active");
        return data;
    },

    async createTenant(tenant) {
        const { data } = await apiClient.post("/tenants", tenant);
        return data;
    },

    async updateTenant(id, tenant) {
        const { data } = await apiClient.put(`/tenants/${id}`, tenant);
        return data;
    },

    async deleteTenant(id) {
        const { data } = await apiClient.delete(`/tenants/${id}`);
        return data;
    },

    async checkOutTenant(id) {
        const { data } = await apiClient.post(`/tenants/${id}/check-out`);
        return data;
    },
};
