import { useMutation, useQuery } from "@tanstack/react-query";
import { stockApi } from "@/services/stock.api";
import { useToast } from "./use-toast";
import { saveAs } from "file-saver";
import { queryClient } from "@/lib/react-query";

export const useStockQuery = (page: number, pageSize: number, search: string) => {
    return useQuery({
        queryKey: ["stock", page, pageSize, search],
        queryFn: () => stockApi.getStock(page, pageSize, search),
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