import httpClient from "./axios-config";

export const dashboardApi = {
    getDashboard: async () => {
        const response = await httpClient.get("/api/v1/workspace/dashboard");
        return response.data;
    },

    getRevenueByMonth: async (year: string) => {
        const response = await httpClient.get(`/api/v1/workspace/revenue-by-month?year=${year}`);
        return response.data;
    },
};
