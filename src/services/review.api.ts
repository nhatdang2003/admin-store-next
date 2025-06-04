import httpClient from "./axios-config";

export const reviewApi = {
    getShippingInfo: async () => {
        const response = await httpClient.get("/api/v1/shipping-profiles");
        return response.data;
    },
    getReviewByProduct: async (slug: string) => {
        const response = await httpClient.get(`/api/v1/products/${slug}/reviews`);
        return response.data;
    },
    getReviewByOrder: async (orderId: string) => {
        const response = await httpClient.get(`/api/v1/orders/user/${orderId}/reviews`);
        return response.data;
    },
    createReview: async (data: any) => {
        const response = await httpClient.post("/api/v1/orders/user/reviews", data);
        return response.data;
    },
    updateReview: async (data: any) => {
        const response = await httpClient.put("/api/v1/orders/user/reviews", data);
        return response.data;
    },
};
