"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, Play, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Review } from "@/types/review";
import Image from "next/image";
import { formatPrice, getColorText } from "@/lib/utils";
import { ImageModal } from "../ui/image-modal";

interface ReviewDetailDialogProps {
    review: Review;
    children: React.ReactNode;
}

export function ReviewDetailDialog({ review, children }: ReviewDetailDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const renderStars = (rating: number) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-5 w-5 ${star <= rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                <DialogHeader className="p-6 border-b">
                    <DialogTitle className="text-xl">Chi tiết đánh giá</DialogTitle>
                </DialogHeader>

                {review ? (
                    <div className="p-6 space-y-6">
                        {/* Product Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Product Image */}
                            <div className="md:col-span-1">
                                <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-gray-100">
                                    {review.productVariantDTO.imageUrl ? (
                                        <Image
                                            src={review.productVariantDTO.imageUrl}
                                            alt={review.productVariantDTO.productName}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            <ImageIcon className="h-12 w-12" />
                                            <span className="ml-2 text-sm">Hình ảnh sản phẩm</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="md:col-span-2 space-y-4">
                                <div>
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Thông tin đánh giá
                                        </h3>
                                        <Badge variant={review.published ? "default" : "secondary"}>
                                            {review.published ? "Hiển thị" : "Ẩn"}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <p>Mã đơn hàng: <strong>{review.orderCode}</strong></p>
                                        <p className="font-medium text-gray-900">
                                            Tên sản phẩm: {review.productVariantDTO.productName}
                                        </p>
                                        <p>
                                            Ngày đánh giá: {format(new Date(review.createdAt), "dd/MM/yyyy HH:mm", {
                                                locale: vi,
                                            })}
                                        </p>
                                        <div className="flex items-center gap-4 font-medium text-gray-600">
                                            <span>Màu sắc: <strong>{getColorText(review.productVariantDTO.color)}</strong></span>
                                            <span>Kích cỡ: <strong>{review.productVariantDTO.size}</strong></span>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        Thông tin khách hàng
                                    </h3>
                                    <div className="space-y-2">
                                        <p className="font-medium text-gray-900">
                                            Tên khách hàng: {review.userReviewDTO.firstName || review.userReviewDTO.lastName
                                                ? `${review.userReviewDTO.firstName || ''} ${review.userReviewDTO.lastName || ''}`.trim()
                                                : 'Khách hàng ẩn danh'
                                            }
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            Số điện thoại: {review.userReviewDTO.phoneNumber}
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            Số lần đánh giá: {review.userReviewDTO.totalReview}
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            Số tiền đã tiêu: {formatPrice(review.userReviewDTO.totalSpend)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Review Content */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Nội dung đánh giá
                            </h3>

                            {/* Rating */}
                            <div className="mb-4">
                                <div className="flex items-center gap-3">
                                    {renderStars(review.rating)}
                                    <span className="text-lg font-semibold text-gray-900">
                                        {review.rating}/5
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        ({review.rating === 5 ? 'Rất hài lòng' :
                                            review.rating === 4 ? 'Hài lòng' :
                                                review.rating === 3 ? 'Bình thường' :
                                                    review.rating === 2 ? 'Không hài lòng' : 'Rất không hài lòng'})
                                    </span>
                                </div>
                            </div>

                            {/* Review Text */}
                            <div className="mb-6">
                                <p className="text-sm text-gray-600 mb-2">Nhận xét:</p>
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                        {review.description || "Khách hàng không để lại nhận xét."}
                                    </p>
                                </div>
                            </div>

                            {/* Review Media */}
                            {review.imageUrls && review.imageUrls.length > 0 && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Hình ảnh từ khách hàng ({review.imageUrls.length}):
                                    </p>

                                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                                        {review.imageUrls.map((imageUrl, index) => (
                                            <ImageModal
                                                key={index}
                                                src={imageUrl}
                                                alt={`Review image ${index + 1}`}
                                            >
                                                <div className="relative aspect-square rounded-lg overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity">
                                                    <Image
                                                        src={imageUrl}
                                                        alt={`Review thumbnail ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </ImageModal>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Review Videos */}
                            {review.videoUrl && (
                                <div className="mt-6">
                                    <p className="text-sm text-gray-600 mb-3">
                                        Video từ khách hàng:
                                    </p>

                                    <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                                        <video
                                            src={review.videoUrl}
                                            controls
                                            className="w-full h-full object-cover"
                                        >
                                            Trình duyệt không hỗ trợ video.
                                        </video>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        Không tìm thấy thông tin đánh giá
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
} 