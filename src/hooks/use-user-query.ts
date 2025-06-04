import { userApi } from "@/services/user.api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";

interface UserQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  initialData?: any;
}

export const useUserListQuery = ({
  page = 1,
  pageSize = 20,
  search,
  initialData,
}: UserQueryParams) => {
  return useQuery({
    queryKey: ["users", page, pageSize, search],
    queryFn: () => userApi.getUsers(page, pageSize, search),
    initialData,
  });
};

export const useAddUserMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Thành công",
        description: "Thêm người dùng thành công",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: error.message || "Không thể thêm người dùng",
      });
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Thành công",
        description: "Cập nhật người dùng thành công",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: error.message || "Không thể cập nhật người dùng",
      });
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Thành công",
        description: "Xóa người dùng thành công",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: error.message || "Không thể xóa người dùng",
      });
    },
  });
};
