import type { Category, CategoryListResponse } from "@/types/category";
import httpClient, { tokenManager } from "./axios-config";

export const categoryApi = {
    getCategories: async (
        page: number = 1,
        pageSize: number = 10,
        search?: string
    ) => {
        let url = `/api/v1/categories?page=${page - 1}&size=${pageSize}`;
        if (search) {
            url += `&filter=name~'${encodeURIComponent(search)}'`;
        }
        url += "&sort=createdAt,desc";
        const response = await httpClient.get(url);
        return response.data;
    },

    addCategory: async (category: Omit<Category, "id">) => {
        console.log(category);
        const response = await httpClient.post("/api/v1/categories", category);
        return response.data;
    },

    updateCategory: async ({ id, ...category }: Category) => {
        console.log(id, category);
        const response = await httpClient.put("/api/v1/categories", {
            id,
            ...category,
        });
        return response.data;
    },

    deleteCategory: async (id: number) => {
        const response = await httpClient.delete(`/api/v1/categories/${id}`);
        return response.data;
    },

    downloadTemplateImportCategory: async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/v1/workspace/import/template/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenManager.getAccessToken()}`
            },
        });
        return response.blob();
    },

    importCategory: (data: any) => {
        return httpClient.post("/api/v1/workspace/import/categories", data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};
