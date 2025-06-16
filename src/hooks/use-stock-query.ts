import { useMutation, useQuery } from "@tanstack/react-query";
import { stockApi } from "@/services/stock.api";
import { useToast } from "./use-toast";
import { saveAs } from "file-saver";
import { queryClient } from "@/lib/react-query";

export const useStockQuery = (page: number, pageSize: number, search: string, sort?: string) => {
    return useQuery({
        queryKey: ["stock", page, pageSize, search, sort],
        queryFn: () => stockApi.getStock(page, pageSize, search, sort),
    });
};

export const useExportExcelStock = () => {
    const { toast } = useToast();

    return useMutation({
        mutationFn: async () => {
            const response = await stockApi.getExportStock();

            saveAs(response, 'ton-kho.xlsx');
        },
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Thành công",
                description: "Xuất excel tồn kho thành công",
            });
        },
        onError: (error: any) => {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: error?.response?.data?.message || "Không thể xuất excel tồn kho",
            });
        },
    });
};

export const useImportStockQuery = () => {
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: any) => stockApi.importStock(data),
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Thành công",
                description: "Nhập kho thành công",
            });
            queryClient.invalidateQueries({ queryKey: ["stock"] });
            queryClient.invalidateQueries({ queryKey: ["stock-history"] });
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Nhập kho thất bại",
            });
        },
    });
};

export const useUpdateStockQuery = () => {
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: any) => stockApi.updateStock(data),
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Thành công",
                description: "Cập nhật tồn kho thành công",
            });
            queryClient.invalidateQueries({ queryKey: ["stock"] });
            queryClient.invalidateQueries({ queryKey: ["stock-history"] });
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Cập nhật tồn kho thất bại",
            });
        },
    });
};

export const useStockHistoryQuery = (page: number, size: number, sku?: string, startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: ["stock-history", page, size, sku, startDate, endDate],
        queryFn: () => stockApi.getStockHistory(page, size, sku, startDate, endDate),
    });
};

export const useExportExcelStockHistory = () => {
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (data: any) => {
            const response = await stockApi.getExportStockHistory(data.sku, data.startDate, data.endDate);

            saveAs(response, 'lich-su-ton-kho.xlsx');
        },
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Thành công",
                description: "Xuất excel lịch sử tồn kho thành công",
            });
        },
        onError: (error: any) => {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: error?.response?.data?.message || "Không thể xuất excel lịch sử tồn kho",
            });
        },
    });
};