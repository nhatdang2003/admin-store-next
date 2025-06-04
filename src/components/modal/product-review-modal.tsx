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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import {
  useCreateReview,
  useReview,
  useUpdateReview,
} from "@/hooks/use-review-query";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getColorText } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
}

interface ProductReviewModalProps {
  orderId: string;
}

function StarRating({ rating, onRatingChange, disabled }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-6 h-6 cursor-pointer transition-colors",
            (hoverRating || rating) >= star
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onMouseEnter={() => !disabled && setHoverRating(star)}
          onMouseLeave={() => !disabled && setHoverRating(0)}
          onClick={() => !disabled && onRatingChange(star)}
        />
      ))}
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <Skeleton className="w-24 h-24 sm:w-16 sm:h-16 rounded" />
        <div className="space-y-2 text-center sm:text-left">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
}

export function ProductReviewModal({ orderId }: ProductReviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [descriptions, setDescriptions] = useState<{ [key: number]: string }>(
    {}
  );
  const { data: reviews, isLoading } = useReview(orderId);
  const { mutate: createReview } = useCreateReview();
  const { mutate: updateReview } = useUpdateReview();

  const handleSubmit = async (index: number, review: any) => {
    try {
      const reviewData = {
        orderId: orderId,
        reviewItem: {
          lineItemId: review.lineItemId,
          rating: ratings[index] || review.rating,
          description: descriptions[index] || review.description,
        },
      };
      console.log(reviewData);
      if (review.rating || review.description) {
        // Update existing review
        updateReview({
          ...reviewData,
          reviewId: review.reviewId,
        });
      } else {
        // Create new review
        createReview(reviewData);
      }

      const newRatings = { ...ratings };
      delete newRatings[index];
      setRatings(newRatings);

      const newDescriptions = { ...descriptions };
      delete newDescriptions[index];
      setDescriptions(newDescriptions);

      // Close modal if no more items to review
      if (Object.keys(newRatings).length === 0) {
        setIsOpen(false);
      }
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <Star className="h-4 w-4 mr-2" />
          Đánh giá
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3/4 max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 border-b flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl">
            Đánh giá sản phẩm
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="p-6">
            <ReviewSkeleton />
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="flex-1 overflow-y-auto">
            {reviews.map((review: any, index: number) => (
              <div
                key={review.lineItemId}
                className="p-6 border-b last:border-b-0"
              >
                <div className="flex flex-col sm:flex-row items-center md:items-start space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                  <img
                    src={review.variantImage}
                    alt={review.productName}
                    className="aspect-[2/3] w-24 sm:w-16 object-cover rounded"
                  />
                  <div className="text-center sm:text-left">
                    <p className="font-semibold">{review.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {getColorText(review.color)} - {review.size}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`rating-${index}`}
                      className="text-sm font-medium"
                    >
                      Đánh giá của bạn <span className="text-red-500">*</span>
                    </Label>
                    <StarRating
                      rating={ratings[index] || review.rating || 0}
                      onRatingChange={(rating) =>
                        setRatings({ ...ratings, [index]: rating })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`description-${index}`}
                      className="text-sm font-medium"
                    >
                      Nhận xét của bạn <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id={`description-${index}`}
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                      value={descriptions[index] || review.description || ""}
                      onChange={(e) =>
                        setDescriptions({
                          ...descriptions,
                          [index]: e.target.value,
                        })
                      }
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="button"
                    disabled={
                      (!ratings[index] && !review.rating) ||
                      (ratings[index] === 0 && !review.rating) ||
                      (!descriptions[index] && !review.description)
                    }
                    className="w-full"
                    onClick={() => handleSubmit(index, review)}
                  >
                    {review.rating !== null && review.description !== null
                      ? "Cập nhật đánh giá"
                      : "Gửi đánh giá"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            Không tìm thấy thông tin sản phẩm
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
