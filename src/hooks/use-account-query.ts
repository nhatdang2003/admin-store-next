import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountApi } from "@/services/account.api";
import { toast, useToast } from "./use-toast";
import { ChangePasswordRequest, CreatePasswordRequest, UserInfo } from "@/types/account";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";

export function useAccountProfile() {
    const { toast } = useToast();

    return useQuery({
        queryKey: ["account-profile"],
        queryFn: async () => {
            try {
                return await accountApi.getProfile();
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải thông tin người dùng",
                    variant: "destructive",
                });
                throw error;
            }
        },
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const router = useRouter();
    const setUser = useUserStore((state: any) => state.setUser);

    return useMutation({
        mutationFn: async (data: UserInfo) => {
            return await accountApi.updateProfile({
                ...data,
                birthDate: data.birthDate ? format(data.birthDate, "yyyy-MM-dd") : null,
            });
        },
        onSuccess: (data) => {
            console.log(data)
            toast({
                title: "Thành công",
                description: "Cập nhật thông tin thành công",
                variant: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["account-profile"] });
            setUser({
                id: data.id,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                activated: data.activated,
                role: {
                    id: data.role?.id,
                    name: data.role?.name,
                },
            });
            router.refresh();
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

export function useCreatePassword() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePasswordRequest) => accountApi.createPassword(data),
        onSuccess: () => {
            toast({
                title: "Thành công",
                description: "Tạo mật khẩu thành công",
                variant: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["account-profile"] });
        },
        onError: () => {
            toast({
                title: "Lỗi",
                description: "Đã có lỗi xảy ra",
                variant: "destructive",
            });
        },
    });
}

export const useChangePassword = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ChangePasswordRequest) =>
            accountApi.changePassword(data),
        onSuccess: () => {
            toast({
                title: "Thành công",
                description: "Đổi mật khẩu thành công",
                variant: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["account"] });
        },
        onError: (error: any) => {
            toast({
                title: "Lỗi",
                description: error.message || "Đã có lỗi xảy ra",
                variant: "destructive",
            });
        },
    });
};

export function useAccountInfo() {
    const { toast } = useToast();

    return useQuery({
        queryKey: ["account-profile"],
        queryFn: async () => {
            try {
                return await accountApi.getInfo();
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải thông tin người dùng",
                    variant: "destructive",
                });
                throw error;
            }
        },
    });
}
