import apiClient from "../apiClient";

export const electricityApi = {
    async getReadings() {
        const { data } = await apiClient.get("/electricity");
        return data;
    },

    async saveReading(reading) {
        const { data } = await apiClient.post("/electricity", reading);
        return data;
    },

    async getTenantReadings(tenantId) {
        const { data } = await apiClient.get(`/electricity/tenant/${tenantId}`);
        return data;
    },
};
