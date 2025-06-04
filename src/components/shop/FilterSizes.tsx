"use client";

import { Size } from "@/constants/product";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface FilterSizesProps {
  className?: string;
}

export function FilterSizes({ className }: FilterSizesProps) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Lấy sizes từ URL khi component mount
    const sizesFromUrl = searchParams.get("sizes")?.split(",") || [];
    setSelectedSizes(sizesFromUrl);
  }, [searchParams]);

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSelectedSizes = checked
      ? [...selectedSizes, size]
      : selectedSizes.filter((s) => s !== size);

    setSelectedSizes(newSelectedSizes);

    // Cập nhật URL
    const params = new URLSearchParams(searchParams);
    if (newSelectedSizes.length > 0) {
      params.set("sizes", newSelectedSizes.join(","));
    } else {
      params.delete("sizes");
    }

    // Reset về trang 1 khi filter thay đổi
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  const sizes = Object.keys(Size)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      value: Size[key as keyof typeof Size],
      label: key,
    }));

  return (
    <div className={className}>
      <h3 className="font-semibold mb-4">Kích thước</h3>
      <div className="space-y-3">
        {sizes.map(({ value, label }) => (
          <div key={value} className="flex items-center space-x-2">
            <Checkbox
              id={`size-${value}`}
              checked={selectedSizes.includes(label)}
              onCheckedChange={(checked) =>
                handleSizeChange(label, checked as boolean)
              }
            />
            <Label htmlFor={`size-${value}`}>{label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
