import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/auth.api";
import { redirect, useRouter } from "next/navigation";
import { toast, useToast } from "./use-toast";
import type { LoginCredentials, RegisterCredentials } from "@/types/auth";
import { PROTECTED_PATHS } from "@/constants/routes";
import { useUserStore } from "@/stores/useUserStore";
import { useWebSocket } from "@/contexts/websocket.context";

export const authKeys = {
    all: ["auth"] as const,
    profile: () => [...authKeys.all, "profile"] as const,
    login: () => [...authKeys.all, "login"] as const,
    register: () => [...authKeys.all, "register"] as const,
};

export function useLogin(redirect: string) {
    const router = useRouter();
    const { toast } = useToast();
    const setAuthenticated = useUserStore((state: any) => state.setAuthenticated)
    const { connect } = useWebSocket();

    return useMutation({
        mutationKey: authKeys.login(),
        mutationFn: (data: LoginCredentials) => authApi.login(data),
        onSuccess: (data: any) => {
            if (data.data && data.data.user) {
                setAuthenticated(data.data.user)
            }
            router.push(redirect ?? "/");
            router.refresh();
            connect();
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: error?.response?.data?.message || "Đăng nhập thất bại",
            });
        },
    });
}

export function useRegister() {
    const { toast } = useToast();
    const router = useRouter();

    const registerMutation = useMutation({
        mutationFn: (data: RegisterCredentials) => authApi.register(data),
        onSuccess: (_, variables) => {
            router.push(`/verify-otp?email=${variables.email}`);
            toast({
                title: "Đăng ký thành công",
                description: "Vui lòng kiểm tra email để xác thực tài khoản của bạn",
                variant: "success",
            });
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Không thể gửi email xác thực. Vui lòng thử lại sau.",
            });
        },
    });

    return {
        ...registerMutation,
    };
}

export function useActivateAccount() {
    const { toast } = useToast();
    const router = useRouter();

    return useMutation({
        mutationFn: (key: string) => authApi.activateAccount(key),
        onSuccess: () => {
            toast({
                title: "Xác thực thành công",
                description:
                    "Tài khoản của bạn đã được kích hoạt. Chúc bạn mua hàng vui vẻ!",
                variant: "success",
            });
            router.push("/");
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description:
                    error?.message || "Không thể kích hoạt tài khoản. Vui lòng thử lại.",
            });
        },
    });
}

export function useLogout(redirect?: string) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const resetAuthenticated = useUserStore((state: any) => state.resetAuthenticated)

    return useMutation({
        mutationFn: async () => {
            const data = await authApi.logout();

            resetAuthenticated();

            return data;
        },
        onSuccess: () => {
            // Clear all queries and cache
            queryClient.clear();
            if (redirect && PROTECTED_PATHS.some((path) => redirect.startsWith(path))) {
                router.push("/login");
            } else {
                router.push(redirect ?? "/");
            }
            router.refresh();
        },
    });
}

export const useForgotPassword = () => {
    const router = useRouter();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: { email: string }) => authApi.forgotPassword(data),
        onSuccess: (_, variables) => {
            router.push(`/verify-otp?email=${variables.email}&type=reset-password`);
            toast({
                title: "Yêu cầu đặt lại mật khẩu đã được gửi",
                description: "Vui lòng kiểm tra email của bạn.",
                variant: "success",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: error.message || "Đã có lỗi xảy ra",
            });
        },
    });
};

export const useResetPassword = () => {
    const { toast } = useToast();
    return useMutation({
        mutationFn: (data: { email: string, resetCode: string, newPassword: string; confirmPassword: string }) => authApi.resetPassword(data),
        onSuccess: () => {
            toast({
                title: "Mật khẩu đã được đặt lại thành công",
                description: "Vui lòng đăng nhập.",
                variant: "success",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: error.message || "Đã có lỗi xảy ra",
            });
        },
    });
};

export const useGoogleLogin = () => {
    const router = useRouter();
    const setAuthenticated = useUserStore((state: any) => state.setAuthenticated)

    return useMutation({
        mutationFn: (code: string) => authApi.google(code),
        onSuccess: (data: any) => {
            if (data.data && data.data.user) {
                setAuthenticated(data.data.user)
            }
            router.push("/");
            router.refresh();
        },
        onError: (error: any) => {
            console.log(error.message);
        },
    });
};

export const useVerifyOtp = () => {
    const router = useRouter();
    const setAuthenticated = useUserStore((state: any) => state.setAuthenticated)
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: { email: string, activationCode: string }) => authApi.verifyOtp(data),
        onSuccess: (data: any) => {
            if (data.data && data.data.user) {
                setAuthenticated(data.data.user)
            }
            router.push("/");
            router.refresh();
            toast({
                title: "Kích hoạt tài khoản thành công",
                description: "Tài khoản của bạn đã được kích hoạt. Chúc bạn mua hàng vui vẻ!",
                variant: "success",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: error.message || "Đã có lỗi xảy ra",
            });
        },
    });
};

export const useVerifyResetPassword = () => {
    const router = useRouter();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: { email: string, resetCode: string }) => authApi.verifyResetPasswordCode(data),
        onSuccess: (_, variables) => {
            toast({
                title: "Xác thực mã OTP thành công",
                description: "Vui lòng đặt lại mật khẩu.",
                variant: "success",
            });
            router.push(`/reset-password?email=${variables.email}&code=${variables.resetCode}`);
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: error.message || "Đã có lỗi xảy ra",
            });
        },
    });
};
