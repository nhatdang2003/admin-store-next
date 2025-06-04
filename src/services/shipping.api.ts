import { ShippingInfoSchema } from "@/schemas/shipping-info.schema";
import httpClient from "./axios-config";

export const shippingApi = {
    getShippingInfo: async () => {
        const response = await httpClient.get("/api/v1/shipping-profiles");
        return response.data;
    },
    createShippingInfo: async (data: ShippingInfoSchema) => {
        const response = await httpClient.post("/api/v1/shipping-profiles", data);
        return response.data;
    },
    updateShippingInfo: async (data: ShippingInfoSchema) => {
        const response = await httpClient.put("/api/v1/shipping-profiles", data);
        return response.data;
    },
    deleteShippingInfo: async (id: string) => {
        const response = await httpClient.delete(`/api/v1/shipping-profiles/${id}`);
        return response.data;
    },
    setDefaultShippingProfile: async (id: string) => {
        const response = await httpClient.post("/api/v1/shipping-profiles/default", { shippingProfileId: id });
        return response.data;
    },
};
