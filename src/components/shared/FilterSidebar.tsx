"use client";

import { useEffect, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { Category, CategoryListResponse } from "@/types/category";
import { formatPrice } from "@/lib/utils";
import { FilterCategories } from "../shop/FilterCategories";
import { FilterPriceRange } from "../shop/FilterPriceRange";
import { FilterRatings } from "../shop/FilterRatings";
import { FilterColors } from "../shop/FilterColors";
import { FilterSizes } from "../shop/FilterSizes";

export function FilterSidebar({
  categories,
}: {
  categories: CategoryListResponse;
}) {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <div className="w-full md:w-72 flex flex-col gap-4">
      <div className="md:hidden">
        <button
          className="w-full bg-gray-200 p-2 rounded-md text-left"
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        >
          Filters
        </button>
      </div>
      <div
        className={`${
          isMobileFilterOpen ? "opacity-100" : "max-h-0 opacity-0"
        } md:max-h-none md:opacity-100 transition-all duration-300 ease-in-out md:block space-y-6`}
      >
        <FilterCategories className="mx-1" categories={categories.data} />
        <FilterColors className="mx-1" />
        <FilterSizes className="mx-1" />
        <FilterPriceRange className="mx-1" />
        <FilterRatings className="mx-1" />
      </div>
    </div>
  );
}
