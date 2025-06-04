"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface FilterPriceRangeProps {
  className?: string;
}

export function FilterPriceRange({ className = "" }: FilterPriceRangeProps) {
  const [minPrice, setMinPrice] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Lấy giá trị price range từ URL khi component mount
    const minPriceFromUrl = searchParams.get("minPrice");
    const maxPriceFromUrl = searchParams.get("maxPrice");
    setMinPrice(minPriceFromUrl);
    setMaxPrice(maxPriceFromUrl);
  }, [searchParams]);

  const handleApplyFilter = () => {
    // Validate giá trị
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    // Kiểm tra giá trị hợp lệ
    if (
      (min !== null && (isNaN(min) || min < 0)) ||
      (max !== null && (isNaN(max) || max < 0)) ||
      (min !== null && max !== null && min > max)
    ) {
      toast({
        title: "Giá trị không hợp lệ",
        description: "Vui lòng kiểm tra lại giá trị nhập vào",
      });
      return;
    }

    // Cập nhật URL
    const params = new URLSearchParams(searchParams);

    // Chỉ thêm params khi có giá trị
    if (min !== null) {
      params.set("minPrice", min.toString());
    } else {
      params.delete("minPrice");
    }

    if (max !== null) {
      params.set("maxPrice", max.toString());
    } else {
      params.delete("maxPrice");
    }

    // Reset về trang 1 khi filter thay đổi
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("minPrice");
    params.delete("maxPrice");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={className}>
      <h3 className="font-semibold mb-2">Khoảng giá</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Giá thấp nhất"
            value={minPrice || ""}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full"
          />
          <span>-</span>
          <Input
            type="number"
            placeholder="Giá cao nhất"
            value={maxPrice || ""}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          onClick={handleApplyFilter}
          className="w-full"
          variant="outline"
        >
          Áp dụng
        </Button>
        <Button
          onClick={handleClearFilter}
          className="w-full"
          variant="outline"
        >
          Xóa
        </Button>
        <div className="text-sm text-gray-500">
          {minPrice && maxPrice && (
            <>
              Giá hiện tại: {formatPrice(Number(minPrice))} -{" "}
              {formatPrice(Number(maxPrice))}
            </>
          )}
          {!minPrice && !maxPrice && (
            <>Giá hiện tại: 0 - {formatPrice(10000000)}</>
          )}
          {minPrice && !maxPrice && (
            <>Giá hiện tại: {formatPrice(Number(minPrice))} - </>
          )}
          {!minPrice && maxPrice && (
            <>Giá hiện tại: - {formatPrice(Number(maxPrice))}</>
          )}
        </div>
      </div>
    </div>
  );
}
