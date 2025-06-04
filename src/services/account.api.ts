import { ChangePasswordRequest, CreatePasswordRequest } from "@/types/account";
import httpClient from "./axios-config";

export const accountApi = {
    getInfo: async () => {
        const response = await httpClient.get("/api/v1/users/info");
        return response.data;
    },
    getProfile: async () => {
        const response = await httpClient.get("/api/v1/users/profiles");
        return response.data;
    },
    updateProfile: async (data: any) => {
        const response = await httpClient.put("/api/v1/users/edit-profile", data);
        return response.data;
    },
    getShippingInfo: async () => {
        const response = await httpClient.get("/api/v1/shipping-profiles");
        return response.data;
    },
    createPassword: async (data: CreatePasswordRequest) => {
        const response = await httpClient.post("/api/v1/users/create-password", data);
        return response.data;
    },
    changePassword: async (data: ChangePasswordRequest) => {
        const response = await httpClient.put("/api/v1/users/change-password", data);
        return response.data;
    },
    getRoles: async () => {
        const response = await httpClient.get("/api/v1/users/roles");
        return response.data;
    },
};
