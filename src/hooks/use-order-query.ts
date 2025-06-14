import { queryClient } from "@/lib/react-query";
import { orderApi } from "@/services/order.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";

export const useOrder = (id: string) => {
    return useQuery({
        queryKey: ["order", id],
        queryFn: () => orderApi.getOrderById(id),
        enabled: !!id,
    });
};

export const useOrders = ({
    page = 1,
    size = 6,
    status = "",
    search = "",
    paymentStatus = "",
    orderStatus = "",
    paymentMethod = "",
    deliveryMethod = "",
    from = "",
    to = "",
}: {
    page?: number;
    size?: number;
    status?: string;
    search?: string;
    paymentStatus?: string;
    orderStatus?: string;
    paymentMethod?: string;
    deliveryMethod?: string;
    from?: string;
    to?: string;
}) => {
    return useQuery({
        queryKey: ["orders", page, size, status, search, paymentStatus, orderStatus, paymentMethod, deliveryMethod, from, to],
        queryFn: () => orderApi.getOrders(page, size, status, search, paymentStatus, orderStatus, paymentMethod, deliveryMethod, from, to),
    });
};

export const useUpdateOrderStatus = () => {
    const { toast } = useToast();
    return useMutation({
        mutationFn: (data: { orderId: string; status: string }) =>
            orderApi.updateOrderStatus(data.orderId, data.status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["order"] });
            toast({
                title: "Cập nhật trạng thái thành công",
                variant: "success",
            });
        },
        onError: () => {
            toast({
                title: "Cập nhật trạng thái thất bại",
                variant: "destructive",
            });
        },
    });
};
