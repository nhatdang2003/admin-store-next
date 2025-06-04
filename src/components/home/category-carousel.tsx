"use client";

import * as React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCategoryListQuery } from "@/hooks/use-category-query";
import Image from "next/image";
import Link from "next/link";

export default function CategoryCarousel() {
    const [api, setApi] = React.useState<any>();
    const { data, isLoading, error } = useCategoryListQuery({
        page: 1,
        pageSize: 10000,
    });
    const categories = data?.data;

    React.useEffect(() => {
        if (!api) return;

        const intervalId = setInterval(() => {
            if (api?.canScrollNext()) {
                api.scrollNext();
            } else {
                api.scrollTo(0);
            }
        }, 4000);

        return () => clearInterval(intervalId);
    }, [api]);

    return (
        <div className="container max-w-6xl mx-auto px-4 pb-8 relative">
            <h2 className="text-2xl font-semibold mb-4 text-center">
                Danh Mục Sản Phẩm
            </h2>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                setApi={setApi}
            >
                <CarouselContent>
                    {categories?.map((category: any, index: number) => {
                        return (
                            <CarouselItem
                                key={index}
                                className="basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4"
                            >
                                <Link
                                    href={`/shop?categories=${category.id}`}
                                    className="block group"
                                >
                                    <Card className="overflow-hidden border-2 transition-all duration-300 group-hover:border-primary">
                                        <CardContent className="p-0 relative">
                                            <div className="relative aspect-[4/5] overflow-hidden">
                                                <Image
                                                    src={category.imageUrl}
                                                    alt={category.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-100 md:opacity-0 transition-opacity duration-300 md:group-hover:opacity-100" />
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-0 md:translate-y-full transition-transform duration-300 md:group-hover:translate-y-0">
                                                <h3 className="text-lg font-semibold leading-tight">
                                                    {category.name}
                                                </h3>
                                                <p className="mt-2 text-sm text-white/80">
                                                    Khám phá bộ sưu tập →
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>

                <CarouselPrevious className="absolute left-8 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white/70 hover:bg-white/90 z-50" />
                <CarouselNext className="absolute right-8 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/70 hover:bg-white/90 z-50" />
            </Carousel>
        </div>
    );
}
