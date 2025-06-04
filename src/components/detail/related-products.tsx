import Image from "next/image";
import ProductCard from "../shared/Product";
import { Product } from "@/types/product";

export default function RelatedProducts({ relatedProducts }: any) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-2 gap-4 md:hidden">
        {relatedProducts.slice(0, 4).map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="hidden md:grid md:grid-cols-3 md:gap-4 lg:hidden">
        {relatedProducts.slice(0, 6).map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="hidden lg:grid lg:gap-4 lg:grid-cols-5">
        {relatedProducts.slice(0, 8).map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
