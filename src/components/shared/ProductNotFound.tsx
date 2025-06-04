import { Home, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <ShoppingBag className="w-24 h-24 text-gray-400 mb-8" />
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Không tìm thấy sản phẩm
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Rất tiếc! Chúng tôi không thể tìm thấy sản phẩm bạn đang tìm kiếm trong
        bộ sưu tập của chúng tôi. Hãy khám phá những bộ sưu tập mới nhất của
        chúng tôi nhé?
      </p>
      <div className="flex space-x-4">
        <Button asChild>
          <Link href="/shop">
            <ShoppingBag className="mr-2 h-4 w-4" /> Shop
          </Link>
        </Button>
      </div>
    </div>
  );
}
