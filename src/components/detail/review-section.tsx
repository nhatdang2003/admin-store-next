import { reviewApi } from "@/services/review.api";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface Review {
  reviewId: number;
  rating: number;
  description: string;
  createdAt: string;
  firstName: string | null;
  lastName: string | null;
  variant: {
    color: string;
    size: string;
    variantId: number;
  };
}

export default async function ReviewSection({ slug }: { slug: string }) {
  let reviews: { data: Review[] } = { data: [] };
  try {
    reviews = await reviewApi.getReviewByProduct(slug);
  } catch (error) {
    return <div>Đã có lỗi xảy ra</div>;
  }

  return (
    <section className="mt-8 md:mt-12">
      <h2 className="text-xl md:text-2xl font-bold mb-4">
        Đánh giá của khách hàng
      </h2>
      <div className="space-y-4">
        {reviews.data.length > 0 ? (
          reviews.data.map((review) => (
            <div key={review.reviewId} className="border-b pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 mb-2">
                <div className="flex items-center">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 md:w-5 md:h-5 ${
                          i < review.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-sm md:text-base">
                    {review.firstName || review.lastName
                      ? `${review.firstName || ""} ${review.lastName || ""}`
                      : "Khách hàng ẩn danh"}
                  </span>
                </div>
                <div className="flex items-center sm:ml-auto">
                  <span className="text-gray-500 text-sm">
                    {format(new Date(review.createdAt), "dd MMMM, yyyy", {
                      locale: vi,
                    })}
                  </span>
                </div>
              </div>
              <div className="mb-2 text-xs md:text-sm text-gray-600">
                Phiên bản: {review.variant.color} - {review.variant.size}
              </div>
              <p className="text-sm md:text-base text-gray-700">
                {review.description}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">Chưa có đánh giá</div>
        )}
      </div>
    </section>
  );
}
