import { httpClient } from "./axios-config";

export const returnApi = {
    getReturnRequests: async (page: number, size: number, status?: string, search?: string) => {
        let url = `/api/v1/return-requests?page=${page - 1}&size=${size}`;
        if (status) {
            url += `&filter=status~'${status}'`;
        }
        if (search) {
            url += `&filter=order.code~~'${search}'`;
        }
        const response = await httpClient.get(url);
        return response.data;
    },
    getReturnRequestById: async (id: string) => {
        const response = await httpClient.get(`/api/v1/return-requests/${id}`);
        return response.data;
    },
    updateReturnRequestStatus: async (id: string, status: string, adminComment: string) => {
        const response = await httpClient.put(`/api/v1/return-requests/process`, {
            returnRequestId: id,
            status,
            adminComment,
        });
        return response.data;
    },
    updateCashBackStatus: async (id: string, cashBackStatus: string) => {
        const response = await httpClient.put(`/api/v1/return-requests/cashback`, {
            returnRequestId: id,
            cashBackStatus,
        });
        return response.data;
    },
};
