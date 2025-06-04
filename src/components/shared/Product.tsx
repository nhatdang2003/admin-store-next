"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Star } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

export default function ProductCard({ product }: { product: any }) {
    const [isHovered, setIsHovered] = useState(false);

    const calculateDiscountPercentage = (price: number, discountRate: number) => {
        return Math.round(discountRate * 100);
    };

    return (
        <Card
            className="w-full bg-card text-card-foreground shadow-sm group cursor-pointer overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/shop/${product.slug}`}>
                <div className="relative overflow-hidden">
                    <div className="relative aspect-[2/3]">
                        {product.images.length > 1 && (
                            <Image
                                src={product.images[1]}
                                alt={`${product.name} - Hình ảnh thứ 2`}
                                fill
                                className={`
                  absolute inset-0 rounded-t-lg object-cover 
                  transition-[visibility,opacity,transform] duration-[350ms,350ms,600ms] ease-[ease,ease,cubic-bezier(.61,1,.88,1)]
                  ${isHovered
                                        ? "visible opacity-100 scale-106"
                                        : "invisible opacity-0 scale-100"
                                    }
                `}
                            />
                        )}
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className={`
                rounded-t-lg object-cover
                transition-[visibility,opacity,transform] duration-[350ms,350ms,600ms] ease-[ease,ease,cubic-bezier(.61,1,.88,1)]
                ${isHovered
                                    ? "invisible opacity-0 scale-106"
                                    : "visible opacity-100 scale-100"
                                }
              `}
                        />
                    </div>
                    {product.discountRate > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute top-2 right-2 z-10"
                        >
                            -
                            {calculateDiscountPercentage(product.price, product.discountRate)}
                            %
                        </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg">
                        <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-lg font-semibold text-white line-clamp-2">
                                {product.name}
                            </h3>
                            <span className="text-gray-200">{product.categoryName}</span>
                        </div>
                    </div>
                </div>
                <CardContent className="py-4 px-3">
                    <div className="flex items-start sm:items-end flex-col sm:flex-row gap-2">
                        <div
                            className={`text-xl font-bold leading-none ${product.discountRate > 0 ? "text-red-500" : ""
                                }`}
                        >
                            {formatPrice(product.minPriceWithDiscount)}
                        </div>
                        {product.discountRate > 0 && (
                            <div className="text-sm font-bold leading-none line-through text-gray-500">
                                {formatPrice(product.minPrice)}
                            </div>
                        )}
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                        {product.averageRating ? (
                            <>
                                <span className="text-sm md:text-base leading-none">
                                    {" "}
                                    {(product.averageRating).toFixed(1)}
                                </span>
                                <Star
                                    className="h-4 sm:h-6 w-4 sm:w-6 fill-yellow-400"
                                    color="yellow-400"
                                />
                            </>
                        ) : (
                            <span className="text-sm text-muted-foreground">
                                Chưa có đánh giá
                            </span>
                        )}
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}
