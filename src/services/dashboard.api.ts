import httpClient from "./axios-config";

export const dashboardApi = {
    getDashboard: async () => {
        const response = await httpClient.get("/api/v1/workspace/dashboard");
        return response.data;
    },

    getRevenueByMonth: async (year: string) => {
        const response = await httpClient.get(`/api/v1/workspace/dashboard/revenue-chart?year=${year}`);
        return response.data;
    },

    getSummary: async () => {
        const response = await httpClient.get("/api/v1/workspace/dashboard/summary?period=this_week");
        return response.data;
    },

    getCategorySalesChart: async (period: string) => {
        const response = await httpClient.get(`/api/v1/workspace/dashboard/category-sales?period=${period}`);
        return response.data;
    },

    getTopProducts: async (period: string) => {
        const response = await httpClient.get(`/api/v1/workspace/dashboard/top-products?period=${period}`);
        return response.data;
    },

    getLowStockProducts: async () => {
        const response = await httpClient.get(`/api/v1/inventory?page=0&size=10&sort=quantity,asc`);
        return response.data;
    },

    getTopReturnRequests: async () => {
        const response = await httpClient.get(`/api/v1/return-requests?page=0&size=5&sort=createdAt,desc`);
        return response.data;
    },
};
