import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "@/services/category.api";
import type { CategoryListResponse, Category } from "@/types/category";
import { useToast } from "./use-toast";
import { saveAs } from 'file-saver';

interface CategoryQueryParams {
    page: number;
    pageSize: number;
    search?: string;
    initialData?: CategoryListResponse;
}

export const useCategoryListQuery = ({
    page,
    pageSize,
    search,
    initialData,
}: CategoryQueryParams) => {
    return useQuery({
        queryKey: ["categories", page, pageSize, search],
        queryFn: () => categoryApi.getCategories(page, pageSize, search),
        initialData: search ? undefined : initialData,
    });
};

export const useAddCategoryMutation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: categoryApi.addCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({
                title: "Thành công",
                description: "Thêm danh mục thành công",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra",
                description: error.message || "Không thể thêm danh mục",
            });
        },
    });
};

export const useUpdateCategoryMutation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: categoryApi.updateCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({
                title: "Thành công",
                description: "Cập nhật danh mục thành công",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra",
                description: error.message || "Không thể cập nhật danh mục",
            });
        },
    });
};

export const useDeleteCategoryMutation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: categoryApi.deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({
                title: "Thành công",
                description: "Xóa danh mục thành công",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra",
                description: error.message || "Không thể xóa danh mục",
            });
        },
    });
};

export const useDownloadTemplateImportCategory = () => {
    const { toast } = useToast();

    return useMutation({
        mutationFn: async () => {
            const response = await categoryApi.downloadTemplateImportCategory();

            saveAs(response, 'mau-danh-muc.xlsx');
        },
        onSuccess: () => {
            toast({
                title: "Thành công",
                description: "Đã tải template về thành công",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: error?.message || "Không thể tải template",
            });
        },
    });
};

// Thêm hook import category
export const useImportCategoryMutation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: any) => categoryApi.importCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({
                title: "Thành công",
                description: "Import danh mục thành công",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: error?.response?.data?.message || "Không thể import danh mục",
            });
        },
    });
};
