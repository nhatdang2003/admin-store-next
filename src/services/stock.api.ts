import { httpClient, tokenManager } from "./axios-config";

export const stockApi = {
    getStock: async (page: number, size: number, search: string) => {
        let url = `/api/v1/inventory?page=${page - 1}&size=${size}`;
        if (search) {
            url += `&search=${search}`;
        }
        const response = await httpClient.get(url);
        return response.data;
    },
    getExportStock: async () => {
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/v1/inventory/export`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${tokenManager.getAccessToken()}`
        //     },
        // });
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
};