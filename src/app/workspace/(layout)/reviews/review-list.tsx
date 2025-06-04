"use client";

import { useState } from "react";
import {
    Star,
    Trash2,
    MoreHorizontal,
    Eye,
    EyeOff
} from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
    useReviewListQuery,
    useToggleReviewVisibilityMutation,
    useDeleteReviewMutation,
} from "@/hooks/use-review-query";
import { ReviewDetailDialog } from "@/components/reviews/review-detail-dialog";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Review } from "@/types/review";

const PAGE_SIZE = 10;

// Rating filter options
const ratingOptions = [
    { value: "All", label: "Tất cả đánh giá" },
    { value: "5", label: "5 sao" },
    { value: "4", label: "4 sao" },
    { value: "3", label: "3 sao" },
    { value: "2", label: "2 sao" },
    { value: "1", label: "1 sao" },
];

export default function ReviewList() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const page = searchParams.get("page");
    const search = searchParams.get("search");
    const rating = searchParams.get("rating") || "All";

    const { data, isLoading } = useReviewListQuery({
        page: Number(page || 1),
        pageSize: PAGE_SIZE,
        search: search || undefined,
        rating: rating ? Number(rating) : undefined,
    });

    const toggleVisibilityMutation = useToggleReviewVisibilityMutation();
    const deleteReviewMutation = useDeleteReviewMutation();

    const [deletingReview, setDeletingReview] = useState<any>(null);

    const handleRatingChange = (newRating: string) => {
        const params = new URLSearchParams(searchParams);

        if (newRating) {
            params.set("rating", newRating);
        } else {
            params.delete("rating");
        }

        // Reset to page 1 when filter changes
        params.delete("page");

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleToggleVisibility = async (reviewId: number, published: boolean) => {
        try {
            await toggleVisibilityMutation.mutateAsync({ reviewId, published: !published });
        } catch (error) {
            // Error handled in mutation
        }
    };

    const handleDeleteReview = async () => {
        if (!deletingReview) return;

        try {
            await deleteReviewMutation.mutateAsync(deletingReview.reviewId);
            setDeletingReview(null);
        } catch (error) {
            // Error handled in mutation
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                            }`}
                    />
                ))}
            </div>
        );
    };

    const reviews = data?.data || [];
    const meta = data?.meta;

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Quản lý đánh giá</h2>

            <div className="flex justify-between items-center">
                <SearchInput placeholder="Tìm kiếm theo tên sản phẩm..." className="w-[300px]" />

                {/* Rating Filter */}
                <Select value={rating} onValueChange={handleRatingChange}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Lọc theo đánh giá" />
                    </SelectTrigger>
                    <SelectContent>
                        {ratingOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mã đơn hàng</TableHead>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead>Đánh giá</TableHead>
                        <TableHead>Nội dung</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reviews.map((review: Review) => (
                        <TableRow key={review.reviewId}>
                            <TableCell>{review.orderCode}</TableCell>
                            <TableCell>
                                <div className="font-medium">{review.productVariantDTO?.productName}</div>
                            </TableCell>
                            <TableCell>
                                {review.userReviewDTO?.firstName || review.userReviewDTO?.lastName
                                    ? `${review.userReviewDTO?.firstName || ''} ${review.userReviewDTO?.lastName || ''}`.trim()
                                    : 'Ẩn danh'
                                }
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {renderStars(review.rating)}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="max-w-xs truncate" title={review.description}>
                                    {review.description || "Không có nhận xét"}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={review.published ? "default" : "secondary"}>
                                    {review.published ? "Hiển thị" : "Ẩn"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {format(new Date(review.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <ReviewDetailDialog review={review}>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Xem chi tiết
                                            </DropdownMenuItem>
                                        </ReviewDetailDialog>

                                        <DropdownMenuItem
                                            onClick={() => handleToggleVisibility(review.reviewId, review.published)}
                                            className="cursor-pointer"
                                        >
                                            {review.published ? (
                                                <>
                                                    <EyeOff className="mr-2 h-4 w-4" />
                                                    Ẩn
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Hiển thị
                                                </>
                                            )}
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            className="text-destructive cursor-pointer"
                                            onClick={() => setDeletingReview(review)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Xóa
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {reviews.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    {search || rating ?
                        `Không tìm thấy đánh giá nào`
                        : "Chưa có đánh giá nào"}
                </div>
            )}

            {meta && (
                <Pagination currentPage={meta.page + 1} totalPages={meta.pages} />
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deletingReview}
                onOpenChange={() => setDeletingReview(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này sẽ xóa đánh giá này và không thể khôi phục.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteReview}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {deleteReviewMutation.isPending ? "Đang xóa..." : "Xóa"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
} 