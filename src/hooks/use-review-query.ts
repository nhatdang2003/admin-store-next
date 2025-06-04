import { queryClient } from "@/lib/react-query";
import { reviewApi } from "@/services/review.api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { useQueryClient } from "@tanstack/react-query";

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

// New admin management hooks - simplified
interface ReviewQueryParams {
    page: number;
    pageSize: number;
    search?: string;
    rating?: number;
}

export const useReviewListQuery = ({
    page,
    pageSize,
    search,
    rating,
}: ReviewQueryParams) => {
    return useQuery({
        queryKey: ["reviews", page, pageSize, search, rating],
        queryFn: () => reviewApi.getReviews(page, pageSize, search, rating),
    });
};

export const useToggleReviewVisibilityMutation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: { reviewId: number, published: boolean }) => reviewApi.toggleReviewVisibility(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            toast({
                variant: "success",
                title: "Thành công",
                description: "Cập nhật trạng thái hiển thị thành công",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra",
                description: error.message || "Không thể cập nhật trạng thái hiển thị",
            });
        },
    });
};

export const useDeleteReviewMutation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (reviewId: number) => reviewApi.deleteReview(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            toast({
                variant: "success",
                title: "Thành công",
                description: "Xóa đánh giá thành công",
            });
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra",
                description: error.message || "Không thể xóa đánh giá",
            });
        },
    });
};
