import apiClient from "./apiClient";

export const roomApi = {
    async getRooms() {
        const { data } = await apiClient.get("/rooms");
        return data;
    },

    async getAvailableRooms() {
        const { data } = await apiClient.get("/rooms/available");
        return data;
    },

    async createRoom(room) {
        const { data } = await apiClient.post("/rooms", room);
        return data;
    },

    async updateRoom(id, room) {
        const { data } = await apiClient.put(`/rooms/${id}`, room);
        return data;
    },

    async deleteRoom(id) {
        const { data } = await apiClient.delete(`/rooms/${id}`);
        return data;
    },

    async getBeds(roomId) {
        const { data } = await apiClient.get(`/rooms/${roomId}/beds`);
        return data;
    },

    async updateBedStatus(roomId, bedId, status) {
        const { data } = await apiClient.patch(`/rooms/${roomId}/beds/${bedId}/status`, { status });
        return data;
    },
};
