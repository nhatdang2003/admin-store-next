import { Metadata } from "next";
import { Suspense } from "react";
import ReviewList from "./review-list";

export const metadata: Metadata = {
    title: "Quản lý đánh giá",
    description: "Quản lý đánh giá sản phẩm từ khách hàng",
};

export default function ReviewsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReviewList />
        </Suspense>
    );
}