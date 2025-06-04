import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { promotionApi } from "@/services/promotion.api";
import { useToast } from "./use-toast";

interface PromotionQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  initialData?: any;
}

export const usePromotionListQuery = ({
  page = 1,
  pageSize = 20,
  search,
  initialData,
}: PromotionQueryParams) => {
  return useQuery({
    queryKey: ["promotions", page, pageSize, search],
    queryFn: () => promotionApi.getPromotions(page, pageSize, search),
    initialData,
  });
};

export const useAddPromotionMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: promotionApi.createPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      toast({
        title: "Thành công",
        description: "Thêm khuyến mãi thành công",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: error.message || "Không thể thêm khuyến mãi",
      });
    },
  });
};

export const useUpdatePromotionMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: promotionApi.updatePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      toast({
        title: "Thành công",
        description: "Cập nhật khuyến mãi thành công",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: error.message || "Không thể cập nhật khuyến mãi",
      });
    },
  });
};

export const useDeletePromotionMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: promotionApi.deletePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      toast({
        title: "Thành công",
        description: "Xóa khuyến mãi thành công",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: error.message || "Không thể xóa khuyến mãi",
      });
    },
  });
};
