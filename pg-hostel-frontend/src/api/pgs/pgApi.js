import apiClient from "../apiClient";

export const pgApi = {
    async getPgs() {
        const { data } = await apiClient.get("/pgs");
        return data;
    },

    async createPg(pg) {
        const { data } = await apiClient.post("/pgs", pg);
        return data;
    },
};
