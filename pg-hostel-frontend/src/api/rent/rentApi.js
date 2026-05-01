import apiClient from "../apiClient";

export const rentApi = {
    async getRentPayments() {
        const { data } = await apiClient.get("/rent");
        return data;
    },

    async getPendingRentPayments() {
        const { data } = await apiClient.get("/rent/pending");
        return data;
    },

    async getTenantRentPayments(tenantId) {
        const { data } = await apiClient.get(`/rent/tenant/${tenantId}`);
        return data;
    },

    async generateMonthlyRent(month, year) {
        const { data } = await apiClient.post("/rent/generate-monthly", null, {
            params: { month, year },
        });
        return data;
    },

    async markAsPaid(id, payment) {
        const { data } = await apiClient.post(`/rent/${id}/pay`, payment);
        return data;
    },

    async updateRentPayment(id, payment) {
        const { data } = await apiClient.put(`/rent/${id}`, payment);
        return data;
    },
};
