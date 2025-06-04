import { queryClient } from "@/lib/react-query";
import { reviewApi } from "@/services/review.api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";

export const useReview = (orderId: string) => {
  return useQuery({
    queryKey: ["review-order", orderId],
    queryFn: () => reviewApi.getReviewByOrder(orderId),
    enabled: !!orderId,
  });
};

export const useCreateReview = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => reviewApi.createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-order"] });
      toast({
        title: "Thành công",
        description: "Đánh giá sản phẩm thành công",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Thất bại",
        description: "Đánh giá sản phẩm thất bại",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateReview = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => reviewApi.updateReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-order"] });
      toast({
        title: "Thành công",
        description: "Cập nhật đánh giá thành công",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Thất bại",
        description: "Cập nhật đánh giá thất bại",
        variant: "destructive",
      });
    },
  });
};
