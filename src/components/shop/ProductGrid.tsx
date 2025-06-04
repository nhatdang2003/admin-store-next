"use client";

import { useState } from "react";
import ProductCard from "../shared/Product";
import { Pagination } from "../shared/pagination";
import { ShoppingBag } from "lucide-react";

export function ProductGrid({ productsData }: { productsData: any }) {
  return (
    <div className="flex-1">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {productsData.data.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {productsData.data.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center px-4">
          <ShoppingBag className="w-24 h-24 text-gray-400 mb-8" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Không tìm thấy sản phẩm
          </h2>
          <p className="text-gray-600 mb-8 max-w-md">
            Rất tiếc! Chúng tôi không thể tìm thấy sản phẩm bạn đang tìm kiếm
            trong bộ sưu tập của chúng tôi.
          </p>
        </div>
      )}

      <Pagination
        currentPage={productsData.meta.page + 1}
        totalPages={productsData.meta.pages}
        className="mt-8"
      />
    </div>
  );
}
