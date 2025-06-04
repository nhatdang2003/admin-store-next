"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCard from "../shared/Product";
import ProductNotFound from "../shared/ProductNotFound";

// Define product type
interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    category: string;
    rating: number;
}

// Define products type
interface ProductCategories {
    [key: string]: Product[];
}

export default function ProductShowcase({
    products,
}: {
    products: ProductCategories;
}) {
    const [activeTab, setActiveTab] = useState("featured");

    return (
        <div className="container max-w-6xl mx-auto px-4 py-8">
            <Tabs
                defaultValue="featured"
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="featured">NỔI BẬT</TabsTrigger>
                    <TabsTrigger value="new">MỚI</TabsTrigger>
                    <TabsTrigger value="sale">
                        <span className="text-red-500">GIẢM GIÁ</span>
                    </TabsTrigger>
                </TabsList>
                {Object.entries(products).map(([key, items]) => (
                    <TabsContent key={key} value={key}>
                        {items.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 gap-4 md:hidden">
                                    {items.slice(0, 4).map((product: Product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                                <div className="hidden md:grid md:grid-cols-3 md:gap-4 lg:hidden">
                                    {items.slice(0, 6).map((product: Product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                                <div className="hidden lg:grid lg:gap-4 lg:grid-cols-4">
                                    {items.slice(0, 8).map((product: Product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <ProductNotFound />
                        )}
                    </TabsContent>
                ))}
            </Tabs>
            <div className="mt-8 text-center">
                <Link href="/shop">
                    <Button size="lg">Xem thêm</Button>
                </Link>
            </div>
        </div>
    );
}
