"use client";

import { useState, useRef, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useDebounce } from "@/hooks/use-debounce";
import { Product } from "@/types/product";
import { productApi } from "@/services/product.api";
import { formatPrice } from "@/lib/utils";

export function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (debouncedSearch.trim() === "") {
        setResults([]);
        return;
      }

      try {
        setIsLoading(true);
        console.log("Searching for:", debouncedSearch);
        const response = await productApi.getProductsBySearch(debouncedSearch);
        console.log("Search response:", response);

        const products = response || [];
        console.log("Processed products:", products);

        setResults(products.data);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchProducts();
  }, [debouncedSearch]);

  return (
    <div className="relative w-full" ref={searchRef}>
      <Input
        type="search"
        placeholder="Tìm kiếm..."
        className="pl-10 pr-4 py-2 rounded-full w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
      />
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />

      {/* Dropdown Results - Simplified conditions */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-[100] max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">Đang tìm kiếm...</div>
          ) : results.length > 0 ? (
            results.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="flex items-center p-2 hover:bg-muted transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  setSearchQuery("");
                }}
              >
                {product.images?.[0] && (
                  <div className="aspect-[2/3] flex-shrink-0 w-12 relative mr-3">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{product.name}</h4>
                  <div className="flex gap-2 items-center">
                    <p className="text-sm text-red-500">
                      {formatPrice(product.minPriceWithDiscount)}
                    </p>
                    {product.discountRate > 0 && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.minPrice)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : searchQuery.trim() !== "" ? (
            <div className="p-4 text-center">Không tìm thấy sản phẩm nào</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
