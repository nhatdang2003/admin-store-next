import httpClient from "./axios-config";

export const promotionApi = {
    getPromotions: async (
        page: number = 1,
        pageSize: number = 10,
        search?: string
    ) => {
        let url = `/api/v1/promotions?page=${page - 1}&size=${pageSize}`;
        if (search) {
            url += `&filter=name~'${encodeURIComponent(search)}'`;
        }
        const response = await httpClient.get(url);
        return response.data;
    },
    createPromotion: (data: any) => {
        return httpClient.post("/api/v1/promotions", data);
    },
    updatePromotion: ({ id, ...data }: any) => {
        return httpClient.put("/api/v1/promotions", { id, ...data });
    },
    deletePromotion: (id: number) => {
        return httpClient.delete(`/api/v1/promotions/${id}`);
    },
};
