import { productApi } from "@/services/product.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { saveAs } from 'file-saver';

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
                variant: "success",
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

export const useDownloadTemplateImportProduct = () => {
    const { toast } = useToast();

    return useMutation({
        mutationFn: async () => {
            const response = await productApi.getTemplateImportProduct();

            saveAs(response, 'mau-san-pham.xlsx');
        },
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Thành công",
                description: "Tải mẫu thành công",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: error?.response?.data?.message || "Không thể tải mẫu",
            });
        },
    });
};

export const useImportProductMutation = () => {
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: any) => productApi.importProduct(data),
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Thành công",
                description: "Import sản phẩm thành công",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: error?.response?.data?.message || "Không thể import sản phẩm",
            });
        },
    });
};