import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/services/cart.api";
import { CartItem } from "@/types/cart";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";

export function useUpdateCartItem() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (newItem: CartItem) => {
            try {
                const response = await cartApi.updateCartItem(newItem);
                return response;
            } catch (error) {
                console.error("Update cart error:", error);
                throw error;
            }
        },
        onMutate: async (newItem: CartItem) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["cart"] });

            // Snapshot the previous value
            const previousCart = queryClient.getQueryData<CartItem[]>(["cart"]) || [];

            // Optimistically update to the new value
            queryClient.setQueryData<CartItem[]>(["cart"], (old = []) => {
                return old.map((item) =>
                    item.cartItemId === newItem.cartItemId
                        ? { ...item, quantity: newItem.quantity }
                        : item
                );
            });

            // Return a context object with the snapshotted value
            return { previousCart };
        },
        onError: (err, newItem, context) => {
            queryClient.setQueryData(["cart"], context?.previousCart);
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Không thể cập nhật số lượng sản phẩm",
            });
        },
        onSettled: async () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });
}

export function useGetCart() {
    const { toast } = useToast();

    return useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            try {
                const response = await cartApi.getCart();
                return response;
            } catch (error: any) {
                if (error.response.status === 401) {
                    return [];
                }
                toast({
                    variant: "destructive",
                    title: "Lỗi",
                    description: "Không thể tải thông tin giỏ hàng",
                });
                throw error;
            }
        },
        staleTime: 1000 * 60, // 1 minute
    });
}

export function useDeleteCartItem() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (cartItemId: number) => {
            try {
                const response = await cartApi.deleteCartItem(cartItemId.toString());
                return response;
            } catch (error) {
                console.error("Delete cart item error:", error);
                throw error;
            }
        },
        onMutate: async (cartItemId: number) => {
            await queryClient.cancelQueries({ queryKey: ["cart"] });
            const previousCart = queryClient.getQueryData<CartItem[]>(["cart"]) || [];

            queryClient.setQueryData<CartItem[]>(["cart"], (old = []) => {
                return old.filter(
                    (item) => item.cartItemId.toString() !== cartItemId.toString()
                );
            });

            return { previousCart };
        },
        onError: (err, cartItemId, context) => {
            console.error("Error details:", err);
            queryClient.setQueryData(["cart"], context?.previousCart);

            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Không thể xóa sản phẩm khỏi giỏ hàng",
            });
        },
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Thành công",
                description: "Đã xóa sản phẩm khỏi giỏ hàng",
            });
        },
        onSettled: async () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });
}

export function useAddToCartMutation() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const router = useRouter();

    return useMutation({
        mutationFn: async ({
            variantId,
            quantity,
        }: {
            variantId: number;
            quantity: number;
        }) => {
            return cartApi.addToCart(variantId, quantity);
        },
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Thêm vào giỏ hàng thành công",
                description: "Sản phẩm đã được thêm vào giỏ hàng của bạn",
            });
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            router.refresh();
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: error?.message || "Không thể thêm sản phẩm vào giỏ hàng",
            });
        },
        onSettled: async () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });
}
