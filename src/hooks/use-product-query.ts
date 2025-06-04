import { productApi } from "@/services/product.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

export const useProductListQuery = (
    page: number,
    size: number,
    search?: string
) => {
    return useQuery({
        queryKey: ["products", page, size, search],
        queryFn: () => productApi.getProducts(page, size, search),
    });
};

export const useAddProductMutation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: any) => productApi.createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast({
                title: "Thêm sản phẩm thành công",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: error?.message || "Đã có lỗi xảy ra khi thêm sản phẩm",
            });
        },
    });
};

export const useUpdateProductMutation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: any) => productApi.updateProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast({
                title: "Cập nhật sản phẩm thành công",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: error?.message || "Đã có lỗi xảy ra khi cập nhật sản phẩm",
            });
        },
    });
};

export const useDeleteProductMutation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (id: string) => productApi.deleteProduct(+id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast({
                title: "Xóa sản phẩm thành công",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: error?.message || "Đã có lỗi xảy ra khi xóa sản phẩm",
            });
        },
    });
};
