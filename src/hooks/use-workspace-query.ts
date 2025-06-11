import { useMutation } from "@tanstack/react-query";
import { authKeys } from "./use-auth-query";
import { workspaceApi } from "@/services/workspace.api";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";
import { AFTER_LOGIN } from "@/constants/workspace";
import { useUserStore } from "@/stores/useUserStore";
import { useWebSocket } from "@/contexts/websocket.context";

type WorkspaceRole = keyof typeof AFTER_LOGIN;

export function useLoginWorkspace(redirect: string) {
    const router = useRouter();
    const { toast } = useToast();
    const setAuthenticated = useUserStore((state: any) => state.setAuthenticated)
    const { connect } = useWebSocket();

    return useMutation({
        mutationKey: ["auth", "login-workspace"],
        mutationFn: (data: any) => workspaceApi.login(data),
        onSuccess: (data: any) => {
            if (data.data && data.data.user) {
                setAuthenticated(data.data.user)
            }
            router.push("/workspace/dashboard");
            router.refresh();
            connect();
        },
        onError: (error: any) => {
            console.log(error.message);
            toast({
                variant: "destructive",
                title: "Đăng nhập thất bại",
                description: error?.response?.data?.message || "Đăng nhập thất bại",
            });
        },
    });
}
