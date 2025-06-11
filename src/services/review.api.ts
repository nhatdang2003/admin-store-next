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

    // Admin management APIs - simplified
    getReviews: async (
        page: number = 1,
        pageSize: number = 10,
        search?: string,
        rating?: number
    ) => {
        let url = `/api/v1/reviews?page=${page - 1}&size=${pageSize}`;
        if (search || rating) {
            url += "&filter=";
        }
        if (rating) {
            url += `rating~'${rating}'`;
        }
        if (search) {
            url += `&filter=lineItem.order.code~~'${encodeURIComponent(search)}'`;
            url += `or product.name~~'${encodeURIComponent(search)}'`;
            url += `or user.profile.fullName~~'${encodeURIComponent(search)}'`;
        }

        url += "&sort=createdAt,desc";
        const response = await httpClient.get(url);
        return response.data;
    },

    getReviewDetail: async (reviewId: number) => {
        const response = await httpClient.get(`/api/v1/workspace/reviews/${reviewId}`);
        return response.data;
    },

    toggleReviewVisibility: async (data: { reviewId: number, published: boolean }) => {
        console.log(data)
        const response = await httpClient.post(`/api/v1/reviews/publish`, data);
        return response.data;
    },

    deleteReview: async (reviewId: number) => {
        const response = await httpClient.delete(`/api/v1/reviews/${reviewId}`);
        return response.data;
    },
};
