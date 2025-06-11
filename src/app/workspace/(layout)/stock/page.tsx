import { Metadata } from "next";
import ProductList from "./stock-list";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Quản lý sản phẩm",
    description: "Quản lý danh sách sản phẩm",
};

export default function ProductsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductList />
        </Suspense>
    );
}
