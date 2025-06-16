import { formatDate } from "date-fns";
import { httpClient, tokenManager } from "./axios-config";

export const stockApi = {
    getStock: async (page: number, size: number, search: string, sort?: string) => {
        let url = `/api/v1/inventory?page=${page - 1}&size=${size}`;
        if (search) {
            url += `&filter=sku~~'${search}' or product.name~~'${search}'`;
        }
        if (sort) {
            url += `&sort=quantity,${sort}`;
        }
        const response = await httpClient.get(url);
        return response.data;
    },
    getExportStock: async () => {
        const response = await httpClient.get("/api/v1/inventory/export", {
            responseType: 'blob'
        });
        console.log(response);
        return response;
    },
    importStock: (data: any) => {
        return httpClient.post("/api/v1/inventory/import", data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    updateStock: (data: any) => {
        return httpClient.put(`/api/v1/inventory`, data);
    },
    getStockHistory: async (page: number, size: number, sku?: string, startDate?: string, endDate?: string) => {
        const params = new URLSearchParams();

        if (sku) params.append("sku", sku);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        let url = `/api/v1/inventory/history?page=${page - 1}&size=${size}&${params.toString()}`;

        const response = await httpClient.get(url);
        return response.data;
    },
    getExportStockHistory: async (sku?: string, startDate?: string, endDate?: string) => {
        const params = new URLSearchParams();

        if (sku) params.append("sku", sku);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const url = `/api/v1/inventory/history/export?${params.toString()}`;
        const response = await httpClient.get(url, { responseType: 'blob' });
        return response;
    }
};