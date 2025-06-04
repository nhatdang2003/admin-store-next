"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { COLOR } from "@/constants/product";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface FilterColorsProps {
  className?: string;
}

export function FilterColors({ className = "" }: FilterColorsProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Lấy colors từ URL khi component mount
    const colorsFromUrl =
      searchParams.get("colors")?.split(",").filter(Boolean) || [];
    setSelectedColors(colorsFromUrl);
  }, [searchParams]);

  const handleColorChange = (colorId: string, checked: boolean) => {
    const newSelectedColors = checked
      ? [...selectedColors, colorId]
      : selectedColors.filter((id) => id !== colorId);

    setSelectedColors(newSelectedColors);

    // Cập nhật URL
    const params = new URLSearchParams(searchParams);
    if (newSelectedColors.length > 0) {
      params.set("colors", newSelectedColors.join(","));
    } else {
      params.delete("colors");
    }

    // Reset về trang 1 khi filter thay đổi
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={className}>
      <h3 className="font-semibold mb-2">Màu sắc</h3>
      <ul className="grid grid-cols-2 gap-2">
        {COLOR.map((color) => (
          <li key={color.id} className="flex items-center">
            <Checkbox
              id={`color-${color.id}`}
              checked={selectedColors.includes(color.id)}
              onCheckedChange={(checked) =>
                handleColorChange(color.id, checked as boolean)
              }
            />
            <Label
              htmlFor={`color-${color.id}`}
              className="ml-2 flex items-center gap-2"
            >
              <span
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-sm">{color.name}</span>
            </Label>
          </li>
        ))}
      </ul>
    </div>
  );
}
