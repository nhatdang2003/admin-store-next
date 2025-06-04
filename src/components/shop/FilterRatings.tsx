"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface FilterRatingsProps {
  className?: string;
}

export function FilterRatings({ className = "" }: FilterRatingsProps) {
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ratings = [5, 4, 3, 2, 1];

  useEffect(() => {
    // Lấy rating từ URL khi component mount
    const ratingFromUrl = searchParams.get("rating") || null;
    setSelectedRating(ratingFromUrl);
  }, [searchParams]);

  const handleRatingChange = (rating: number, checked: boolean) => {
    const ratingString = rating.toString();
    // Nếu đang check và khác với rating hiện tại, set rating mới
    // Nếu đang uncheck rating hiện tại, set về null
    const newRating =
      checked && ratingString !== selectedRating ? ratingString : null;

    setSelectedRating(newRating);

    // Cập nhật URL
    const params = new URLSearchParams(searchParams);
    if (newRating) {
      params.set("rating", newRating);
    } else {
      params.delete("rating");
    }

    // Reset về trang 1 khi filter thay đổi
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={className}>
      <h3 className="font-semibold mb-2">Đánh giá</h3>
      <ul className="space-y-2">
        {ratings.map((rating) => (
          <li key={rating} className="flex items-center">
            <Checkbox
              id={`rating-${rating}`}
              checked={selectedRating === rating.toString()}
              onCheckedChange={(checked) =>
                handleRatingChange(rating, checked as boolean)
              }
            />
            <Label
              htmlFor={`rating-${rating}`}
              className="ml-2 flex items-center gap-1"
            >
              {"Từ "}
              {rating}{" "}
              <Star
                className="h-4 sm:h-5 w-4 sm:w-5 fill-yellow-400"
                color="yellow-400"
              />
            </Label>
          </li>
        ))}
      </ul>
    </div>
  );
}
