import httpClient, { tokenManager } from "./axios-config";

export const workspaceApi = {
    login: async (data: any) => {
        const response = await httpClient.post("/api/v1/workspace/login", data);

        if (response.data && response.data.access_token) {
            tokenManager.setAccessToken(response.data.access_token);
        }

        return response;
    },
};
