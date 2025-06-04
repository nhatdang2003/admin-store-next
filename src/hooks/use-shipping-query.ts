import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shippingApi } from "@/services/shipping.api";
import { useToast } from "./use-toast";
import type { ShippingProfile } from "@/types/shipping";
import { useRouter } from "next/navigation";

export function useShippingProfiles() {
    const { toast } = useToast();

    return useQuery({
        queryKey: ["shipping-profiles"],
        queryFn: async () => {
            try {
                return await shippingApi.getShippingInfo();
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải danh sách địa chỉ giao hàng",
                    variant: "destructive",
                });
                throw error;
            }
        },
    });
}

export function useDeleteShippingProfile() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (id: number) => shippingApi.deleteShippingInfo(id.toString()),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shipping-profiles"] });
            toast({
                title: "Thành công",
                description: "Xóa địa chỉ giao hàng thành công",
                variant: "success",
            });
        },
    });
}

export function useUpdateShippingProfile() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (data: ShippingProfile) => {
            const response = await shippingApi.updateShippingInfo(data as any);
            if (data.default) {
                await shippingApi.setDefaultShippingProfile(data.id?.toString()!);
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shipping-profiles"] });
            toast({
                title: "Thành công",
                description: "Cập nhật địa chỉ giao hàng thành công",
                variant: "success",
            });
        },
        onError: () => {
            toast({
                title: "Lỗi",
                description: "Đã có lỗi xảy ra, vui lòng thử lại",
                variant: "destructive",
            });
        },
    });
}

export function useCreateShippingProfile(refresh?: boolean) {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: ShippingProfile) => {
            const response = await shippingApi.createShippingInfo(data as any);
            if (data.default) {
                await shippingApi.setDefaultShippingProfile(response.id?.toString()!);
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shipping-profiles"] });
            toast({
                title: "Thành công",
                description: "Thêm địa chỉ giao hàng thành công",
                variant: "success",
            });
            refresh && window.location.reload();
        },
        onError: (error: any) => {
            console.log(error);
            const errorMessage = error.response?.data?.message ?? "Đã có lỗi xảy ra, vui lòng thử lại";
            toast({
                title: "Lỗi",
                description: errorMessage,
                variant: "destructive",
            });
        },
    });
}
