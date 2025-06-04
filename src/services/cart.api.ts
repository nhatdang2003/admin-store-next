import { CartItem } from "@/types/cart";
import httpClient from "./axios-config";

export const cartApi = {
    getCart: async () => {
        const response = await httpClient.get('/api/v1/carts/items');
        return response.data;
    },
    addToCart: async (variantId: number, quantity: number) => {
        const response = await httpClient.post('/api/v1/carts/items', {
            productVariantId: variantId,
            quantity,
        });
        return response;
    },
    updateCartItem: async (item: CartItem) => {
        const response = await httpClient.put('/api/v1/carts/items', item);
        return response;
    },
    deleteCartItem: async (cartItemId: string) => {
        const response = await httpClient.delete(`/api/v1/carts/items/${cartItemId}`);
        return response;
    },
};
