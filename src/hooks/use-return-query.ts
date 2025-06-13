import { returnApi } from "@/services/return.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

export const useReturnQuery = (page: number, size: number, status?: string, search?: string) => {
    return useQuery({
        queryKey: ["return-requests", page, size, status, search],
        queryFn: () => returnApi.getReturnRequests(page, size, status, search),
    });
};

export const useReturnRequestByIdQuery = (id: string) => {
    return useQuery({
        queryKey: ["return-request", id],
        queryFn: () => returnApi.getReturnRequestById(id),
    });
};

export const useUpdateReturnRequestStatusMutation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: ({ id, status, adminComment }: { id: string; status: string; adminComment: string }) =>
            returnApi.updateReturnRequestStatus(id, status, adminComment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["return-requests"] });
            toast({
                variant: "success",
                title: "Thành công",
                description: "Trạng thái hoàn trả đã được cập nhật thành công",
            });
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Thất bại",
                description: error.message || "Cập nhật trạng thái hoàn trả thất bại",
            });
        },
    });
};

export const useUpdateCashBackStatusMutation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: ({ id, cashBackStatus }: { id: string; cashBackStatus: string }) =>
            returnApi.updateCashBackStatus(id, cashBackStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["return-requests"] });
            toast({
                variant: "success",
                title: "Thành công",
                description: "Trạng thái hoàn trả đã được cập nhật thành công",
            });
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Thất bại",
                description: error.message || "Cập nhật trạng thái hoàn trả thất bại",
            });
        },
    });
};