import httpClient from "./axios-config";

export const checkoutApi = {
    getPreview: async (body: any) => {
        const response = await httpClient.post("/api/v1/orders/preview", body);
        return response.data;
    },
    createOrder: async (body: {
        shippingProfileId: number;
        cartItemIds: number[];
        note: string;
        paymentMethod: string;
        deliveryMethod: string;
    }) => {
        const response = await httpClient.post("/api/v1/orders/check-out", body);
        return response.data;
    },
    vnpayReturn: async (queryString: string) => {
        const response = await httpClient.get(`/api/v1/payment/vnpay_return?${queryString}`);
        return response;
    },
};
