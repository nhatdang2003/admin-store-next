import httpClient from "./axios-config";

export const userApi = {
    getUsers: async (page: number = 1, size: number = 10, search?: string) => {
        let url = `/api/v1/users?page=${page - 1}&size=${size}`;
        if (search) {
            url += `&filter=profile.fullName~'${encodeURIComponent(
                search
            )}' or email~'${encodeURIComponent(search)}'`;
        }
        const response = await httpClient.get(url);

        return response.data;
    },
    createUser: async (data: any) => {
        const response = await httpClient.post("/api/v1/users", data);
        return response.data;
    },
    updateUser: async (data: any) => {
        const response = await httpClient.put("/api/v1/users", data);
        return response.data;
    },
    deleteUser: async (id: string) => {
        const response = await httpClient.delete(`/api/v1/users/${id}`);
        return response.data;
    },
};
