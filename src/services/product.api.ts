import httpClient, { tokenManager } from "./axios-config";

export const productApi = {
    getProducts: async (
        page: number,
        size: number,
        search?: string,
        categories?: string,
        minPrice?: number,
        maxPrice?: number,
        rating?: number,
        colors?: string,
        sizes?: string
    ) => {
        let url = `/api/v1/products?page=${page - 1}&size=${size}`;
        if (minPrice) {
            url += `&minPrice=${minPrice}`;
        }
        if (maxPrice) {
            url += `&maxPrice=${maxPrice}`;
        }
        if (rating) {
            url += `&averageRating=${rating}`;
        }
        if (categories && categories.length > 0) {
            url += `&filter=category.id in [${categories}]`;
        }
        if (colors && colors.length > 0) {
            const arrColor = colors.split(",");
            url += `&filter=(${arrColor
                .map((color) => `variants.color~'${color}'`)
                .join(" or ")})`;
        }
        if (sizes && sizes.length > 0) {
            const arrSize = sizes.split(",");
            url += `&filter=(${arrSize
                .map((size) => `variants.size~'${size}'`)
                .join(" or ")})`;
        }
        if (search) {
            url += `&filter=name~'${search}'`;
        }

        const response = await httpClient.get(url);
        return response.data;
    },
    getProductBySlug: async (slug: string) => {
        const response = await httpClient.get(`/api/v1/products/${slug}`);
        return response.data;
    },
    getFeaturedProducts: async () => {
        const response = await httpClient.get(
            `/api/v1/products?filter=isFeatured`
        );
        return response.data;
    },
    getLatestProducts: async () => {
        const response = await httpClient.get(
            `/api/v1/products?sort=createdAt,desc`
        );
        return response.data;
    },
    getBestSellerProducts: async () => {
        const response = await httpClient.get(
            `/api/v1/products?isBestSeller&days=30`
        );
        return response.data;
    },
    getDiscountProducts: async () => {
        const response = await httpClient.get(
            `/api/v1/products?isDiscounted`
        );
        return response.data;
    },
    getProductsByCategory: async (category: string) => {
        const response = await httpClient.get(
            `/api/v1/products?filter=category.id:${category}`
        );
        return response.data;
    },
    getProductsBySearch: async (search: string) => {
        const response = await httpClient.get(
            `/api/v1/products?filter=name~'${encodeURIComponent(search)}'`
        );
        return response.data;
    },
    createProduct: (data: any) => {
        console.log(">>>>>DATA", data);
        return httpClient.post("/api/v1/products", { ...data.data });
    },
    updateProduct: (data: any) => {
        return httpClient.put("/api/v1/products", { ...data.data });
    },
    deleteProduct: (id: number) => {
        return httpClient.delete(`/api/v1/products/${id}`);
    },
    getTemplateImportProduct: async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/v1/workspace/import/template/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenManager.getAccessToken()}`
            },
        });
        return response.blob();
    },
    importProduct: (data: any) => {
        return httpClient.post("/api/v1/workspace/import/products", data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};
